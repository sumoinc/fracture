import { paramCase } from "change-case";
import { deepMerge } from "projen/lib/util";
import { AccessPattern } from "./access-pattern";
import { FractureComponent } from "./component";
import { Operation } from "./operation";
import {
  ResourceAttribute,
  ResourceAttributeOptions,
} from "./resource-attribute";
import { Service } from "./service";
import { Structure, STRUCTURE_TYPE } from "./structure";
import { DynamoTable } from "../dynamodb/dynamo-table";
import { IdentifierFactory } from "../factories/access-patterns/identifier-factory";
import { LookupFactory } from "../factories/access-patterns/lookup-factory";
import { VersionedIdentifierFactory } from "../factories/access-patterns/versioned-identifier-factory";
import { TypescriptResource } from "../generators/ts/typescript-resource";

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
   * Versioned.
   * @default sevrice default
   */
  isVersioned?: boolean;
  /**
   * The separator to use when composing this attribute from other attributes.
   * @default: uses service level default
   */
  compositionSeperator?: string;
}

export class Resource extends FractureComponent {
  // member components
  public attributes: ResourceAttribute[] = [];
  public operations: Operation[] = [];
  public accessPatterns: AccessPattern[] = [];
  public structures: Structure[] = [];
  public dataStructure: Structure;
  public transientStructure: Structure;
  // parent
  public readonly service: Service;
  // all other options
  public readonly options: Required<ResourceOptions>;
  // generators
  public readonly ts: TypescriptResource;

  constructor(service: Service, options: ResourceOptions) {
    super(service.fracture);

    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     **************************************************************************/

    const defaultOptions: Partial<ResourceOptions> = {
      comments: [`A ${options.name}.`],
      isVersioned: service.isVersioned,
      compositionSeperator:
        service.options.namingStrategy.attributes.compositionSeperator,
    };

    /***************************************************************************
     *
     * INIT RESOURCE
     *
     **************************************************************************/

    // member components

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

    this.project.logger.info(`INIT Resource: "${this.name}"`);

    /***************************************************************************
     *
     * ACCESS PATTERNS
     *
     * Add verioned or non-versioned identifier
     *
     **************************************************************************/

    if (this.isVersioned) {
      new VersionedIdentifierFactory(this);
    } else {
      new IdentifierFactory(this);
    }

    /***************************************************************************1`
     *
     * RESOURCE ATTRIBUTES
     *
     * Add some default attributes based on the resource's options.
     *
     **************************************************************************/

    /**
     * Add an (optional) Audit Strategies
     */

    if (this.auditStrategy.create.dateAttribute) {
      this.addResourceAttribute(this.auditStrategy.create.dateAttribute);
    }
    if (this.auditStrategy.create.userAttribute) {
      this.addResourceAttribute(this.auditStrategy.create.userAttribute);
    }
    if (this.auditStrategy.update.dateAttribute) {
      this.addResourceAttribute(this.auditStrategy.update.dateAttribute);
    }
    if (this.auditStrategy.update.userAttribute) {
      this.addResourceAttribute(this.auditStrategy.update.userAttribute);
    }
    if (this.auditStrategy.delete.dateAttribute) {
      this.addResourceAttribute(this.auditStrategy.delete.dateAttribute);
    }
    if (this.auditStrategy.delete.userAttribute) {
      this.addResourceAttribute(this.auditStrategy.delete.userAttribute);
    }

    /***************************************************************************
     *
     * DATA STRUCTURES
     *
     **************************************************************************/

    this.dataStructure = new Structure(this, { type: STRUCTURE_TYPE.DATA });
    this.transientStructure = new Structure(this, {
      type: STRUCTURE_TYPE.TRANSIENT,
    });

    /***************************************************************************
     *
     * GENERATORS
     *
     **************************************************************************/

    this.ts = new TypescriptResource(this);

    return this;
  }

  public build() {
    this.project.logger.info(`BUILD Resource: "${this.name}"`);
    this.dataStructure.build();
    this.transientStructure.build();
    this.operations.forEach((operation) => {
      operation.build();
    });
    this.accessPatterns.forEach((accessPattern) => {
      accessPattern.build();
    });
    // build generators
    this.ts.build();
  }

  public get name(): string {
    return this.options.name;
  }

  public get isVersioned(): boolean {
    return this.options.isVersioned;
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

  public addLookupSource(attribute: ResourceAttribute) {
    if (!attribute.isRequired) {
      throw new Error(
        `Lookup sources must be required. Attribute "${attribute.name}" is not required.`
      );
    }
    this.lookupAccessPattern.addSkAttributeSource(attribute);
  }

  /*****************************************************************************
   *
   * ACCESS PATTERN / PK and SK HELPERS
   *
   ****************************************************************************/

  public get keyAccessPattern(): AccessPattern {
    return this.accessPatterns.find(
      (accessPattern) => accessPattern.isKeyAccessPattern
    )!;
  }

  public get lookupAccessPattern(): AccessPattern {
    let accessPattern = this.accessPatterns.find(
      (ap) => ap.isLookupAccessPattern
    )!;

    // create it as needed
    if (!accessPattern) {
      accessPattern = new LookupFactory(this).accessPattern;
    }

    return accessPattern;
  }

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
    const returnAttributes = this.attributes.filter((a) =>
      a.isGeneratedOn(operation)
    );

    // optionally filter by public marker
    if (isPublic == undefined) {
      return returnAttributes;
    } else {
      return returnAttributes.filter((a) => a.isPublic === isPublic);
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

  public get namingStrategy() {
    return this.service.namingStrategy;
  }

  public get auditStrategy() {
    return this.service.auditStrategy;
  }
}
