import { paramCase } from "change-case";
import { deepMerge } from "projen/lib/util";
import { AccessPattern } from "./access-pattern";
import { AttributeGenerator, AttributeType } from "./attribute";
import { FractureComponent } from "./component";
import { Operation, OPERATION_SUB_TYPE, OPERATION_TYPE } from "./operation";
import {
  ResourceAttribute,
  ResourceAttributeOptions,
} from "./resource-attribute";
import { Service } from "./service";
import { Structure, STRUCTURE_TYPE } from "./structure";
import { DynamoTable } from "../dynamodb/dynamo-table";

export interface ResourceOptions {
  /**
   *  Name for the Resource.
   */
  name: string;
  /**
   * Short name for the Resource.
   */
  shortName?: string;
  /**
   * Comment lines to add to the Resource.
   * @default []
   */
  comments?: string[];
  /**
   * Should this resource be persisted to a database?
   * @default true
   */
  isPersistant?: boolean;
  /**
   * The separator to use when composing this attribute from other attributes.
   * @default: uses service level default
   */
  compositionSeperator?: string;
}

export class Resource extends FractureComponent {
  // member components
  public attributes: ResourceAttribute[];
  public operations: Operation[];
  public accessPatterns: AccessPattern[];
  public keyAccessPattern: AccessPattern;
  public lookupAccessPattern: AccessPattern;
  public structures: Structure[];
  public dataStructure: Structure;
  // parent
  public readonly service: Service;
  // all other options
  public readonly options: Required<ResourceOptions>;

  constructor(service: Service, options: ResourceOptions) {
    super(service.fracture);

    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     **************************************************************************/

    const defaultOptions: Partial<ResourceOptions> = {
      comments: [`A ${options.name}.`],
      isPersistant: true,
      compositionSeperator:
        service.options.namingStrategy.attributes.compositionSeperator,
    };

    /***************************************************************************
     *
     * INIT RESOURCE
     *
     **************************************************************************/

    // member components
    this.attributes = [];
    this.operations = [];
    this.accessPatterns = [];
    this.structures = [];

    // parent + inverse
    this.service = service;
    this.service.resources.push(this);

    // ensure names are param-cased
    const forcedOptions: Partial<ResourceOptions> = {
      name: paramCase(options.name),
      shortName: options.shortName
        ? paramCase(options.shortName)
        : paramCase(options.name),
    };

    // all other options
    this.options = deepMerge([
      defaultOptions,
      options,
      forcedOptions,
    ]) as Required<ResourceOptions>;

    /***************************************************************************
     *
     * ACCESS PATTERNS
     *
     **************************************************************************/

    this.keyAccessPattern = new AccessPattern(this, {
      dynamoGsi: service.keyDynamoGsi,
    });
    this.lookupAccessPattern = new AccessPattern(this, {
      dynamoGsi: service.lookupDynamoGsi,
    });

    /***************************************************************************1`
     *
     * RESOURCE ATTRIBUTES
     *
     * Add some default attributes based on the resource's options.
     *
     **************************************************************************/

    /**
     * Add a Resource Attribute.
     */
    this.addResourceAttribute({
      name: "id",
      comments: ["The id for the record."],
      type: AttributeType.STRING,
      isRequired: true,
      isPkComponent: true,
      generator: AttributeGenerator.GUID,
      isGeneratedOnCreate: true,
    });

    /**
     * Add type attribute.
     */
    this.addResourceAttribute(this.service.options.typeStrategy);

    /**
     * Add the version attribute if versioned.
     */
    if (this.service.options.isVersioned && this.options.isPersistant) {
      this.addResourceAttribute(this.service.options.versionStrategy.attribute);
    }

    /**
     * Add an (optional) Audit Strategies
     */
    if (this.options.isPersistant) {
      if (this.service.options.auditStrategy.create.dateAttribute) {
        this.addResourceAttribute(
          this.service.options.auditStrategy.create.dateAttribute
        );
      }
      if (this.service.options.auditStrategy.create.userAttribute) {
        this.addResourceAttribute(
          this.service.options.auditStrategy.create.userAttribute
        );
      }
      if (this.service.options.auditStrategy.update.dateAttribute) {
        this.addResourceAttribute(
          this.service.options.auditStrategy.update.dateAttribute
        );
      }
      if (this.service.options.auditStrategy.update.userAttribute) {
        this.addResourceAttribute(
          this.service.options.auditStrategy.update.userAttribute
        );
      }
      if (this.service.options.auditStrategy.delete.dateAttribute) {
        this.addResourceAttribute(
          this.service.options.auditStrategy.delete.dateAttribute
        );
      }
      if (this.service.options.auditStrategy.delete.userAttribute) {
        this.addResourceAttribute(
          this.service.options.auditStrategy.delete.userAttribute
        );
      }
    }

    /***************************************************************************
     *
     * BASE DATA STRUCTURE
     *
     **************************************************************************/

    this.dataStructure = new Structure(this, { type: STRUCTURE_TYPE.DATA });

    /***************************************************************************
     *
     * CRUD OPERATIONS
     *
     **************************************************************************/
    new Operation(this, {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.CREATE_ONE,
    });
    new Operation(this, {
      operationType: OPERATION_TYPE.QUERY,
      operationSubType: OPERATION_SUB_TYPE.READ_ONE,
    });
    new Operation(this, {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.UPDATE_ONE,
    });
    new Operation(this, {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.DELETE_ONE,
    });
    new Operation(this, {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.IMPORT_ONE,
    });

    return this;
  }

  public build() {
    this.dataStructure.build();
    this.operations.forEach((operation) => {
      operation.build();
    });
  }

  public get name(): string {
    return this.options.name;
  }

  /**
   * Adds an attribute
   */
  public addResourceAttribute(options: ResourceAttributeOptions) {
    return new ResourceAttribute(this, options);
  }

  public getAttributeByName(name: string): ResourceAttribute | undefined {
    return this.attributes.find((attribute) => attribute.name === name);
  }

  /*****************************************************************************
   *
   * PK and SK HELPERS
   *
   ****************************************************************************/

  public get partitionKey(): ResourceAttribute {
    return this.keyAccessPattern.pkAttribute;
  }

  public get sortKey(): ResourceAttribute {
    return this.keyAccessPattern.skAttribute;
  }

  public get partitionKeySources(): ResourceAttribute[] {
    return this.partitionKey.compositionSources.filter((resourceAttribute) => {
      return resourceAttribute;
    });
  }

  public get sortKeySources(): ResourceAttribute[] {
    return this.sortKey.compositionSources.filter((resourceAttribute) => {
      return resourceAttribute;
    });
  }

  public get composableAttributes(): ResourceAttribute[] {
    return this.attributes.filter((resourceAttribute) => {
      return resourceAttribute.isComposableGenerator;
    });
  }

  public get composableAttributeSources(): ResourceAttribute[] {
    const returnAttributes: ResourceAttribute[] = [];
    this.composableAttributes.forEach((resourceAttribute) => {
      resourceAttribute.compositionSources.forEach((sourceAttribute) => {
        returnAttributes.push(sourceAttribute);
      });
    });
    return returnAttributes;
  }

  public get dataAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isData);
  }

  public get publicAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isPublic);
  }
  public get privateAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isPrivate);
  }

  // generated attrubutes
  public get createGeneratedAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isGeneratedOnCreate);
  }

  public get updateGeneratedAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isGeneratedOnUpdate);
  }

  public get deleteGeneratedAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isGeneratedOnDelete);
  }

  /**
   *
   * Returns an array of generated attributes for a given operation.
   *
   * @param operation
   * @returns
   */
  public generatedAttributesForOperation(
    operation: Operation,
    isPublic?: boolean
  ): ResourceAttribute[] {
    let returnAttributes: ResourceAttribute[];
    switch (operation.options.operationSubType) {
      case OPERATION_SUB_TYPE.CREATE_ONE:
      case OPERATION_SUB_TYPE.CREATE_MANY:
        returnAttributes = this.createGeneratedAttributes;
        break;
      case OPERATION_SUB_TYPE.UPDATE_ONE:
      case OPERATION_SUB_TYPE.UPDATE_MANY:
        returnAttributes = this.updateGeneratedAttributes;
        break;
      case OPERATION_SUB_TYPE.DELETE_ONE:
      case OPERATION_SUB_TYPE.DELETE_MANY:
        returnAttributes = this.deleteGeneratedAttributes;
        break;
      default:
        throw new Error(
          `Unhandled operation type: ${operation.options.operationSubType}`
        );
    }
    // optionally filter by public marker
    if (isPublic == undefined) {
      return returnAttributes;
    } else {
      return returnAttributes.filter((a) => a.options.isPublic === isPublic);
    }
  }

  /**
   *
   * Returns an of non-generated attributes we need in order to fully form the
   * pk and sk.
   *
   * Don't include data elements sinc they come in already fromt he outside.
   *
   * @param operation
   * @returns
   */
  public externalKeyAttributesForOperation(
    operation: Operation,
    isPublic?: boolean
  ): ResourceAttribute[] {
    const generatedAttributes = this.generatedAttributesForOperation(
      operation,
      isPublic
    );

    return this.composableAttributeSources.filter(
      (keyAttribute) =>
        !keyAttribute.isData &&
        !generatedAttributes.some(
          (generatedAttribute) => keyAttribute === generatedAttribute
        )
    );
  }

  public get dynamoTable(): DynamoTable {
    return this.service.dynamoTable;
  }
}
