import { paramCase } from "change-case";
import { Component } from "projen";
import { Fracture } from "./fracture";
import { TypeScriptSource } from "../generators";

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

  constructor(fracture: Fracture, options: ResourceOptions) {
    super(fracture);

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
     * Typescript
     **************************************************************************/

    new TypeScriptSource(fracture, "foo.ts").comments(["file"]);

    return this;
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
