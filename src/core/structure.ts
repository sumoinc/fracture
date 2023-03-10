import { deepMerge } from "projen/lib/util";
import { SetRequired, ValueOf } from "type-fest";
import { FractureComponent } from "./component";
import { Operation } from "./operation";
import { Resource } from "./resource";
import { ResourceAttribute } from "./resource-attribute";
import { Service } from "./service";
import {
  StructureAttribute,
  STRUCTURE_ATTRIBUTE_TYPE,
} from "./structure-attribute";

/******************************************************************************
 * TYPES
 *****************************************************************************/

export type StructureOptions = {
  /**
   *  Type of structure
   */
  type?: ValueOf<typeof STRUCTURE_TYPE>;
  /**
   * Required if type is input or output
   */
  operation?: Operation;
  /**
   * Comment lines to add to the Structure.
   * @default []
   */
  comments?: string[];
};

export const STRUCTURE_TYPE = {
  INPUT: "Input",
  OUTPUT: "Output",
  /**
   * Represents the structure of persistant data
   */
  DATA: "Data",
  /**
   * Represents the structure of transient data such as messages or events
   */
  TRANSIENT: "Transient",
} as const;

/******************************************************************************
 * CLASS
 *****************************************************************************/

export class Structure extends FractureComponent {
  // member components
  // parent
  public readonly resource: Resource;
  // all other options
  public readonly options: SetRequired<StructureOptions, "type" | "comments">;
  // private cached properties
  private _privateAttributes: StructureAttribute[];
  private _publicAttributes: StructureAttribute[];

  constructor(resource: Resource, options: StructureOptions) {
    super(resource.fracture);

    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     **************************************************************************/

    const defaultOptions: Partial<StructureOptions> = {
      type: STRUCTURE_TYPE.DATA,
      comments: ["A gereric type"],
    };

    /***************************************************************************
     *
     * INIT OPERATION
     *
     **************************************************************************/

    // member components

    // parents + inverse
    this.resource = resource;
    this.resource.structures.push(this);

    // all other options
    this.options = deepMerge([defaultOptions, options]) as SetRequired<
      StructureOptions,
      "type" | "comments"
    >;

    //
    if (
      (this.options.type === STRUCTURE_TYPE.INPUT ||
        this.options.type === STRUCTURE_TYPE.OUTPUT) &&
      !this.options.operation
    ) {
      throw new Error(
        `Operation option is required for Input and Output Structires`
      );
    }

    this._privateAttributes = [];
    this._publicAttributes = [];
  }

  public build() {}

  /**
   * Structure name, based on the naming strategy
   */
  public get name() {
    const resourceName = this.options.operation
      ? this.options.operation.name
      : this.resource.name;
    const prefix =
      this.fracture.options.namingStrategy.structures.prefixes[
        this.options.type
      ];
    const suffix =
      this.fracture.options.namingStrategy.structures.suffixes[
        this.options.type
      ];

    return [prefix, resourceName, suffix]
      .filter((part) => part.length > 0)
      .join("-");
  }

  public getPrivateAttributeByName(shortName: string) {
    return this.privateAttributes.find((a) => a.shortName === shortName);
  }

  public getPublicAttributeByName(name: string) {
    return this.publicAttributes.find((a) => a.name === name);
  }

  /**
   * Includes all public attributes, plus generated attributes and GSI
   * attributes. This is a good list to use for dynamodb operations.
   */
  public get privateAttributes() {
    if (this._privateAttributes.length === 0) {
      let useAttributes: ResourceAttribute[] = [];

      if (
        this.options.type === STRUCTURE_TYPE.DATA ||
        this.options.type === STRUCTURE_TYPE.TRANSIENT
      ) {
        useAttributes = [...useAttributes, ...this.resource.privateAttributes];
      }

      if (this.options.operation) {
        if (this.options.type === STRUCTURE_TYPE.INPUT) {
          // add in all geneated attributes for inputs
          useAttributes = [
            ...useAttributes,
            ...this.resource.generatedAttributesForOperation(
              this.options.operation
            ),
          ];
        }

        if (this.options.type === STRUCTURE_TYPE.OUTPUT) {
          useAttributes = [
            ...useAttributes,
            ...this.resource.composableAttributes,
          ];
        }
      }

      useAttributes.forEach((resourceAttribute) => {
        this._privateAttributes.push(
          new StructureAttribute(this, {
            resourceAttribute,
            structureAttributeType: STRUCTURE_ATTRIBUTE_TYPE.PRIVATE,
          })
        );
      });

      // any in all external attributes
      this.publicAttributes.forEach((a) => {
        this._privateAttributes.push(a);
      });
    }

    // sort and return all attributes
    return this._privateAttributes.sort((a, b) => {
      return a.sortPosition > b.sortPosition
        ? 1
        : a.sortPosition < b.sortPosition
        ? -1
        : 0;
    });
  }

  /**
   * Includes all data attributes that users should have control of. This is
   * a good list for input/output structures in public APIs.
   */
  public get publicAttributes() {
    if (this._publicAttributes.length === 0) {
      let useAttributes: ResourceAttribute[] = [];

      if (this.options.type === STRUCTURE_TYPE.DATA) {
        useAttributes = [...this.resource.publicAttributes];
      }

      if (this.options.operation) {
        if (this.options.type === STRUCTURE_TYPE.INPUT) {
          // For everything except create, we'll need non-generated parts of all keys
          if (!this.options.operation.isCreate) {
            useAttributes = [
              ...useAttributes,
              ...this.resource.externalKeyAttributesForOperation(
                this.options.operation
              ),
            ];
          }

          // last, any write operations need to include data attributes
          if (this.options.operation.isWrite) {
            useAttributes = [...useAttributes, ...this.resource.dataAttributes];
          }
        }

        if (this.options.type === STRUCTURE_TYPE.OUTPUT) {
          useAttributes = [...useAttributes, ...this.resource.publicAttributes];
        }
      }

      useAttributes.forEach((resourceAttribute) => {
        this._publicAttributes?.push(
          new StructureAttribute(this, {
            resourceAttribute,
            structureAttributeType: STRUCTURE_ATTRIBUTE_TYPE.PUBLIC,
          })
        );
      });
    }

    // sort and return all attributes
    return this._publicAttributes.sort((a, b) => {
      return a.sortPosition > b.sortPosition
        ? 1
        : a.sortPosition < b.sortPosition
        ? -1
        : 0;
    });
  }

  public get privateAttributeNames() {
    return this.privateAttributes.map((attribute) => attribute.shortName);
  }
  public get publicAttributeNames() {
    return this.publicAttributes.map((attribute) => attribute.name);
  }

  public get service(): Service {
    return this.resource.service;
  }
}
