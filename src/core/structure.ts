import { deepMerge } from "projen/lib/util";
import { SetRequired, ValueOf } from "type-fest";
import { FractureComponent } from "./component";
import { Operation } from "./operation";
import { Resource } from "./resource";
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
  private _attributes: StructureAttribute[];

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

    this._attributes = [];
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

  public get type() {
    return this.options.type;
  }

  public getStructureAttributeByName(name: string) {
    return this.attributes.find((a) => a.name === name);
  }

  /**
   * Includes all public attributes, plus generated attributes and GSI
   * attributes. This is a good list to use for dynamodb operations.
   */
  public get attributes() {
    if (this._attributes.length === 0) {
      this._attributes = this.resource.attributes
        .filter((resourceAttribute) => {
          switch (this.type) {
            case STRUCTURE_TYPE.DATA:
              return !resourceAttribute.isAccessPatternKey;
            case STRUCTURE_TYPE.INPUT:
              return true;
            case STRUCTURE_TYPE.OUTPUT:
              return !resourceAttribute.isAccessPatternKey;
            case STRUCTURE_TYPE.TRANSIENT:
              return !resourceAttribute.isAccessPatternKey;
          }
        })
        .map((resourceAttribute) => {
          return new StructureAttribute(this, resourceAttribute.options);
        });
    }

    // sort and return all attributes
    return this._attributes.sort((a, b) => {
      return a.sortPosition > b.sortPosition
        ? 1
        : a.sortPosition < b.sortPosition
        ? -1
        : 0;
    });
  }

  /**
   * Attributes that should be exposed to the public. Generally this is
   * everything excluding Access Pattern keys.
   */
  public get publicAttributes() {
    return this.attributes
      .filter((attribute) => !attribute.isAccessPatternKey)
      .filter(
        (attribute) =>
          this.type === STRUCTURE_TYPE.INPUT && !attribute.isTypeGenerator
      );
  }

  public get attributeNames() {
    return this.attributes.map((attribute) => attribute.name);
  }

  public get operation(): Operation | undefined {
    return this.options.operation;
  }

  public get service(): Service {
    return this.resource.service;
  }
}
