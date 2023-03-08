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
      let usaAttributes: ResourceAttribute[] = [];

      if (
        this.options.type === STRUCTURE_TYPE.DATA ||
        this.options.type === STRUCTURE_TYPE.TRANSIENT ||
        this.options.type === STRUCTURE_TYPE.OUTPUT
      ) {
        usaAttributes = [
          ...this.resource.privateAttributes,
          ...this.resource.publicAttributes,
        ];
      }

      if (this.options.type === STRUCTURE_TYPE.INPUT) {
        usaAttributes = [
          ...this.resource.generatedAttributesForOperation(
            this.options.operation!
          ),
          ...this.resource.dataAttributes,
        ];
      }

      usaAttributes.forEach((resourceAttribute) => {
        this._privateAttributes?.push(
          new StructureAttribute(this, { resourceAttribute })
        );
      });
    }

    return this._privateAttributes;
  }

  /**
   * Includes all data attributes that users should have control of. This is
   * a good list for input/output structures in public APIs.
   */
  public get publicAttributes() {
    if (this._publicAttributes.length === 0) {
      let usaAttributes: ResourceAttribute[] = [];

      if (this.options.type === STRUCTURE_TYPE.DATA) {
        usaAttributes = [...this.resource.publicAttributes];
      }

      if (this.options.type === STRUCTURE_TYPE.INPUT) {
        usaAttributes = [...this.resource.dataAttributes];
      }

      usaAttributes.forEach((resourceAttribute) => {
        this._publicAttributes?.push(
          new StructureAttribute(this, { resourceAttribute })
        );
      });
    }

    return this._publicAttributes;
  }

  public get privateAttributeNames() {
    return this.privateAttributes.map((attribute) => attribute.shortName);
  }
  public get publicAttributeNames() {
    return this.publicAttributes.map((attribute) => attribute.name);
  }
}
