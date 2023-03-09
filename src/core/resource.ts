import { paramCase } from "change-case";
import { deepMerge } from "projen/lib/util";
import { ValueOf } from "type-fest";
import { AccessPattern } from "./access-pattern";
import { AuditStrategy } from "./audit-strategy";
import { FractureComponent } from "./component";
import { Operation, OPERATION_SUB_TYPE, OPERATION_TYPE } from "./operation";
import { PartitionKeyStrategy } from "./partition-key-strategy";
import {
  ResourceAttribute,
  ResourceAttributeGenerator,
  ResourceAttributeOptions,
} from "./resource-attribute";
import { Service } from "./service";
import { Structure } from "./structure";
import { TypeStrategy } from "./type-strategy";
import { VersionStrategy } from "./version-strategy";

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
   * Versioned.
   * @default service's default
   */
  isVersioned?: boolean;
  /**
   * The type strategy to use for the partition key.
   */
  partitionKeyStrategy?: PartitionKeyStrategy;
  /**
   * The versioning strategy to use for generated code.
   */
  versionStrategy?: VersionStrategy;
  /**
   * The type strategy to use for generated code.
   */
  typeStrategy?: TypeStrategy;
  /**
   * The audit strategy to use for generated code.
   */
  auditStrategy?: AuditStrategy;
}

export class Resource extends FractureComponent {
  // member components
  public attributes: ResourceAttribute[];
  public operations: Operation[];
  public accessPatterns: AccessPattern[];
  public keyAccessPattern: AccessPattern;
  public structures: Structure[];
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
     * Pull our service defaults, add a default comment if none are otherwise
     * given, and establish a default keyAccessPattern for storing data in
     * DynamoDB.
     *
     **************************************************************************/

    const {
      isVersioned,
      partitionKeyStrategy,
      versionStrategy,
      typeStrategy,
      auditStrategy,
    } = service.options;

    const defaultOptions: Partial<ResourceOptions> = {
      comments: [`A ${options.name}.`],
      isPersistant: true,
      isVersioned,
      partitionKeyStrategy,
      versionStrategy,
      typeStrategy,
      auditStrategy,
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
    this.keyAccessPattern = new AccessPattern(this, {
      name: "key",
      gsi: service.options.dynamodb.keyGsi,
    });
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
     * RESOURCE ATTRIBUTES
     *
     * Add some default attributes based on the resource's options.
     *
     **************************************************************************/

    /**
     * Add the partition key attribute.
     */
    if (this.options.isPersistant) {
      const pkAttribute = this.addResourceAttribute(
        this.options.partitionKeyStrategy
      );
      this.keyAccessPattern.addPkAttribute(pkAttribute);
    }

    /**
     * Add type attribute.
     */
    const typeAttribute = this.addResourceAttribute(this.options.typeStrategy);
    if (this.options.isPersistant) {
      this.keyAccessPattern.addSkAttribute(typeAttribute);
    }

    /**
     * Add the version attribute if versioned.
     */
    if (this.options.isVersioned && this.options.isPersistant) {
      const versionAttribute = this.addResourceAttribute(
        this.options.versionStrategy.attribute
      );
      this.keyAccessPattern.addSkAttribute(versionAttribute);
    }

    /**
     * Add an (optional) Audit Strategies
     */
    if (this.options.isPersistant) {
      if (this.options.auditStrategy.create.dateAttribute) {
        this.addResourceAttribute(
          this.options.auditStrategy.create.dateAttribute
        );
      }
      if (this.options.auditStrategy.create.userAttribute) {
        this.addResourceAttribute(
          this.options.auditStrategy.create.userAttribute
        );
      }
      if (this.options.auditStrategy.update.dateAttribute) {
        this.addResourceAttribute(
          this.options.auditStrategy.update.dateAttribute
        );
      }
      if (this.options.auditStrategy.update.userAttribute) {
        this.addResourceAttribute(
          this.options.auditStrategy.update.userAttribute
        );
      }
      if (this.options.auditStrategy.delete.dateAttribute) {
        this.addResourceAttribute(
          this.options.auditStrategy.delete.dateAttribute
        );
      }
      if (this.options.auditStrategy.delete.userAttribute) {
        this.addResourceAttribute(
          this.options.auditStrategy.delete.userAttribute
        );
      }

      return this;
    }

    /***************************************************************************
     *
     * CRUD OPERATIONS
     *
     * This needs to be done here since we won't know all of the components
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
    new Operation(this, {
      operationType: OPERATION_TYPE.QUERY,
      operationSubType: OPERATION_SUB_TYPE.READ_MANY,
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

  public get partitionKeyCompositionSources(): ResourceAttribute[] {
    return this.partitionKey.compositionSources;
  }

  public get sortKeyCompositionSources(): ResourceAttribute[] {
    return this.sortKey.compositionSources;
  }

  public get gsiKeys(): ResourceAttribute[] {
    const returnAttributes: ResourceAttribute[] = [];
    this.accessPatterns.forEach((accessPattern) => {
      returnAttributes.push(accessPattern.pkAttribute);
      returnAttributes.push(accessPattern.skAttribute);
    });
    return returnAttributes;
  }

  /**
   * All sources required to fully form a valid pk and sk and all GSI keys
   */
  public get keyCompositionSources(): ResourceAttribute[] {
    const returnAttributes: ResourceAttribute[] = [];
    this.accessPatterns.forEach((accessPattern) => {
      accessPattern.pkAttribute.compositionSources.forEach(
        (resourceAttribute) => {
          returnAttributes.push(resourceAttribute);
        }
      );
      accessPattern.skAttribute.compositionSources.forEach(
        (resourceAttribute) => {
          returnAttributes.push(resourceAttribute);
        }
      );
    });
    return returnAttributes;
  }

  public get dataAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isData);
  }

  public get publicAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.options.isPublic);
  }
  public get privateAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => !a.options.isPublic);
  }

  // generated attrubutes
  public get createGeneratedAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isCreateGenerated);
  }
  public get readGeneratedAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isReadGenerated);
  }
  public get updateGeneratedAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isUpdateGenerated);
  }
  public get deleteGeneratedAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isDeleteGenerated);
  }
  public get importGeneratedAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isImportGenerated);
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
      case OPERATION_SUB_TYPE.READ_ONE:
      case OPERATION_SUB_TYPE.READ_MANY:
        returnAttributes = this.readGeneratedAttributes;
        break;
      case OPERATION_SUB_TYPE.UPDATE_ONE:
      case OPERATION_SUB_TYPE.UPDATE_MANY:
        returnAttributes = this.updateGeneratedAttributes;
        break;
      case OPERATION_SUB_TYPE.DELETE_ONE:
      case OPERATION_SUB_TYPE.DELETE_MANY:
        returnAttributes = this.deleteGeneratedAttributes;
        break;
      case OPERATION_SUB_TYPE.IMPORT_ONE:
      case OPERATION_SUB_TYPE.IMPORT_MANY:
        returnAttributes = this.importGeneratedAttributes;
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
   * pk and sk
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

    return this.keyCompositionSources.filter(
      (keyAttribute) =>
        !generatedAttributes.some(
          (generatedAttribute) => keyAttribute === generatedAttribute
        )
    );
  }

  public hasCreateGenerator = (
    generator: ValueOf<typeof ResourceAttributeGenerator>
  ): boolean => {
    return this.createGeneratedAttributes.some(
      (a) => a.options.createGenerator === generator
    );
  };
  public hasReadGenerator = (
    generator: ValueOf<typeof ResourceAttributeGenerator>
  ): boolean => {
    return this.readGeneratedAttributes.some(
      (a) => a.options.readGenerator === generator
    );
  };
  public hasUpdateGenerator = (
    generator: ValueOf<typeof ResourceAttributeGenerator>
  ): boolean => {
    return this.updateGeneratedAttributes.some(
      (a) => a.options.updateGenerator === generator
    );
  };
  public hasDeleteGenerator = (
    generator: ValueOf<typeof ResourceAttributeGenerator>
  ): boolean => {
    return this.deleteGeneratedAttributes.some(
      (a) => a.options.deleteGenerator === generator
    );
  };

  /**
   * Build default operations
   */

  preSynthesize() {
    super.preSynthesize();
  }
}
