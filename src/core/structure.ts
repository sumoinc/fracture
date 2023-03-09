import { deepMerge } from "projen/lib/util";
import { SetRequired, ValueOf } from "type-fest";
import { FractureComponent } from "./component";
import { Operation } from "./operation";
import { Resource } from "./resource";
import { ResourceAttribute } from "./resource-attribute";
import { Service } from "./service";
import { StructureAttribute } from "./structure-attribute";

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
  public readonly attributes: StructureAttribute[];
  // parents
  public readonly resource: Resource;
  public readonly service: Service;
  // all other options
  public readonly options: SetRequired<StructureOptions, "type">;
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
    };

    /***************************************************************************
     *
     * INIT OPERATION
     *
     **************************************************************************/

    // member components
    this.attributes = [];

    // parents + inverse
    this.resource = resource;
    this.service = resource.service;
    this.resource.structures.push(this);

    // all other options
    this.options = deepMerge([defaultOptions, options]) as SetRequired<
      StructureOptions,
      "type"
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
          // add in all geneated attributes next
          useAttributes = [
            ...useAttributes,
            ...this.resource.generatedAttributesForOperation(
              this.options.operation
            ),
          ];
        }

        if (this.options.type === STRUCTURE_TYPE.OUTPUT) {
          useAttributes = [...useAttributes, ...this.resource.gsiKeys];
        }
      }

      useAttributes.forEach((resourceAttribute) => {
        this._privateAttributes.push(
          new StructureAttribute(this, { resourceAttribute })
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
          new StructureAttribute(this, { resourceAttribute })
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
}
