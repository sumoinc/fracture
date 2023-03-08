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
  }

  /**
   * Includes all data attributes that users should have control of. This is
   * a good list for input/output structures in public APIs.
   */
  public get publicAttributes() {
    return this.resource.dataAttributes;
  }

  /**
   * Includes all public attributes, plus generated attributes and GSI
   * attributes. This is a good list to use for dynamodb operations.
   */
  public get privateAttributes() {
    if (this.options.operation) {
      return this.options.operation.generatedAttributes;
    } else {
      return [];
    }
  }
}
