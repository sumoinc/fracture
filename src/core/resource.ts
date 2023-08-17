import { paramCase } from "change-case";
import { Component } from "projen";
import { FractureService } from "./fracture-service";
import {
  ManagementType,
  ResourceAttribute,
  ResourceAttributeGenerator,
  ResourceAttributeOptions,
  VisabilityType,
} from "./resource-attribute";
import { Structure, StructureType } from "./structure";

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
   * Plural name for the Resource.
   */
  pluralName?: string;
  /**
   * Comment lines to add to the Resource.
   * @default []
   */
  comments?: string[];
}

export class Resource extends Component {
  /**
   *  Name for the Resource.
   */
  public readonly name: string;
  /**
   * Short name for the Resource.
   */
  public readonly shortName: string;
  /**
   * Plural name for the Resource.
   */
  public readonly pluralName: string;
  /**
   * Comment lines to add to the Resource.
   *
   * @default []
   */
  public comments: string[];
  /**
   * Primary key for tis resource.
   */
  public pk: ResourceAttribute;
  /**
   * Sort key for tis resource.
   */
  public sk: ResourceAttribute;
  /**
   * Lookup key for tis resource.
   */
  public idx: ResourceAttribute;
  /**
   * All attributes in this resource.
   */
  public attributes: ResourceAttribute[] = [];
  /**
   * Full data strcuture
   */
  public dataStructure: Structure;

  constructor(service: FractureService, options: ResourceOptions) {
    super(service);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = paramCase(options.name);
    this.shortName = options.shortName
      ? paramCase(options.shortName)
      : this.name;
    this.pluralName = options.pluralName
      ? paramCase(options.pluralName)
      : options.name + "s";
    this.comments = options.comments ?? [];

    /***************************************************************************
     * Initial data structure
     **************************************************************************/

    this.dataStructure = new Structure(service, {
      name: `${this.name}-data`,
      type: StructureType.DATA,
    });

    /***************************************************************************
     * Primary Access Pattern
     **************************************************************************/

    this.pk = this.addAttribute({
      name: "id",
      shortName: service.dynamoTable.pk.name,
      comments: [`Identifier for this record.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.USER_VISIBLE,
    });
    this.sk = this.addAttribute({
      name: service.dynamoTable.sk.name,
      comments: [`Sort Key for this record.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.HIDDEN,
      generator: ResourceAttributeGenerator.COMPOSITION,
    });

    /***************************************************************************
     * Lookup Access Pattern
     **************************************************************************/

    this.idx = this.addAttribute({
      name: service.dynamoTable.idx.name,
      comments: [`Lookup value for this record.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.HIDDEN,
    });

    /***************************************************************************
     * Type Attribute
     **************************************************************************/

    const type = this.addAttribute({
      name: "type",
      shortName: "_t",
      comments: [`Type of record.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.USER_VISIBLE,
      generator: ResourceAttributeGenerator.TYPE,
    });
    this.sk.addCompositionSource(type);

    /***************************************************************************
     * Version Attribute
     **************************************************************************/

    const version = this.addAttribute({
      name: "version",
      shortName: "_v",
      comments: [`Verion for record.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.USER_VISIBLE,
      generator: ResourceAttributeGenerator.VERSION_DATE_TIME_STAMP,
    });
    this.sk.addCompositionSource(version);

    return this;
  }

  public addAttribute(options: ResourceAttributeOptions) {
    const service = this.project as FractureService;

    // build resource attribute
    const attribute = new ResourceAttribute(service, options);
    this.attributes.push(attribute);

    // add resource attribute to the data structure
    this.dataStructure.addAttribute({
      name: attribute.name,
      comments: attribute.comments,
      required: true,
    });

    return attribute;
  }

  /***************************************************************************
   *
   * ACCESS PATTERNS
   *
   * Add verioned or non-versioned identifier
   *
   **************************************************************************/

  // if (this.isVersioned) {
  //   new VersionedIdentifierFactory(this);
  // } else {
  //   new IdentifierFactory(this);
  // }

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

  // if (this.auditStrategy.create.dateAttribute) {
  //   this.addResourceAttribute(this.auditStrategy.create.dateAttribute);
  // }
  // if (this.auditStrategy.create.userAttribute) {
  //   this.addResourceAttribute(this.auditStrategy.create.userAttribute);
  // }
  // if (this.auditStrategy.update.dateAttribute) {
  //   this.addResourceAttribute(this.auditStrategy.update.dateAttribute);
  // }
  // if (this.auditStrategy.update.userAttribute) {
  //   this.addResourceAttribute(this.auditStrategy.update.userAttribute);
  // }
  // if (this.auditStrategy.delete.dateAttribute) {
  //   this.addResourceAttribute(this.auditStrategy.delete.dateAttribute);
  // }
  // if (this.auditStrategy.delete.userAttribute) {
  //   this.addResourceAttribute(this.auditStrategy.delete.userAttribute);
  // }

  /***************************************************************************
   *
   * DATA STRUCTURES
   *
   **************************************************************************/

  // this.dataStructure = new Structure(this, { type: STRUCTURE_TYPE.DATA });
  // this.transientStructure = new Structure(this, {
  //   type: STRUCTURE_TYPE.TRANSIENT,
  // });

  /***************************************************************************
   *
   * GENERATORS
   *
   **************************************************************************/

  // this.ts = new TypescriptResource(this);

  /**
   * Adds an attribute
   */
  // public addResourceAttribute(options: ResourceAttributeOptions) {
  //   return new ResourceAttribute(this, options);
  // }

  // public getAttributeByName(name: string): ResourceAttribute | undefined {
  //   return this.attributes.find((attribute) => attribute.name === name);
  // }

  // public addLookupSource(attribute: ResourceAttribute) {
  //   if (!attribute.isRequired) {
  //     throw new Error(
  //       `Lookup sources must be required. Attribute "${attribute.name}" is not required.`
  //     );
  //   }
  //   this.lookupAccessPattern.addSkAttributeSource(attribute);
  // }

  /*****************************************************************************
   *
   * ACCESS PATTERN / PK and SK HELPERS
   *
   ****************************************************************************/

  // public get keyAccessPattern(): AccessPattern {
  //   return this.accessPatterns.find(
  //     (accessPattern) => accessPattern.isKeyAccessPattern
  //   )!;
  // }

  // public get lookupAccessPattern(): AccessPattern {
  //   let accessPattern = this.accessPatterns.find(
  //     (ap) => ap.isLookupAccessPattern
  //   )!;

  //   // create it as needed
  //   if (!accessPattern) {
  //     accessPattern = new LookupFactory(this).accessPattern;
  //   }

  //   return accessPattern;
  // }

  // public get partitionKey(): ResourceAttribute {
  //   return this.keyAccessPattern.pkAttribute;
  // }

  // public get sortKey(): ResourceAttribute {
  //   return this.keyAccessPattern.skAttribute;
  // }

  // public get partitionKeySources(): ResourceAttribute[] {
  //   return this.partitionKey.compositionSources.filter((resourceAttribute) => {
  //     return resourceAttribute;
  //   });
  // }

  // public get sortKeySources(): ResourceAttribute[] {
  //   return this.sortKey.compositionSources.filter((resourceAttribute) => {
  //     return resourceAttribute;
  //   });
  // }

  // public get composableAttributes(): ResourceAttribute[] {
  //   return this.attributes.filter((resourceAttribute) => {
  //     return resourceAttribute.isComposableGenerator;
  //   });
  // }

  // public get composableAttributeSources(): ResourceAttribute[] {
  //   const returnAttributes: ResourceAttribute[] = [];
  //   this.composableAttributes.forEach((resourceAttribute) => {
  //     resourceAttribute.compositionSources.forEach((sourceAttribute) => {
  //       returnAttributes.push(sourceAttribute);
  //     });
  //   });
  //   return returnAttributes;
  // }

  // public get dataAttributes(): ResourceAttribute[] {
  //   return this.attributes.filter((a) => a.isData);
  // }

  // public get publicAttributes(): ResourceAttribute[] {
  //   return this.attributes.filter((a) => a.isPublic);
  // }
  // public get privateAttributes(): ResourceAttribute[] {
  //   return this.attributes.filter((a) => a.isPrivate);
  // }

  /**
   *
   * Returns an array of generated attributes for a given operation.
   *
   * @param operation
   * @returns
   */
  /*
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
  */

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
  /*
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
  */

  // public get dynamoTable(): DynamoTable {
  //   return this.service.dynamoTable;
  // }

  // public get namingStrategy() {
  //   return this.service.namingStrategy;
  // }

  // public get auditStrategy() {
  //   return this.service.auditStrategy;
  // }
}
