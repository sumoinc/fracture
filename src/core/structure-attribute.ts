import { deepMerge } from "projen/lib/util";
import { FractureComponent } from "./component";
import { Resource } from "./resource";
import {
  ResourceAttribute,
  ResourceAttributeOptions,
} from "./resource-attribute";
import { Service } from "./service";
import { Structure } from "./structure";

/******************************************************************************
 * TYPES
 *****************************************************************************/

export type StructureAttributeOptions = {
  /**
   * What resource attribute is this structure attribute based on?
   */
  resourceAttribute: ResourceAttribute;
  /**
   * Replacement / override options for structure attribute
   */
  structureAttributeOptions?: Partial<ResourceAttributeOptions>;
};

/******************************************************************************
 * CLASS
 *****************************************************************************/

export class StructureAttribute extends FractureComponent {
  // member components
  // parent
  public readonly structure: Structure;
  public readonly resource: Resource;
  public readonly service: Service;
  // all other options
  public readonly options: Required<ResourceAttributeOptions>;

  constructor(structure: Structure, options: StructureAttributeOptions) {
    super(structure.fracture);

    /***************************************************************************
     *
     * INIT OPERATION
     *
     **************************************************************************/

    // member components

    // parents + inverse
    this.structure = structure;
    this.resource = structure.resource;
    this.service = structure.resource.service;
    this.structure.attributes.push(this);

    // all other options
    this.options = deepMerge([
      options.resourceAttribute.options,
      options.structureAttributeOptions ?? {},
    ]) as Required<ResourceAttributeOptions>;
  }

  public get name() {
    return this.options.name;
  }

  public get shortName() {
    return this.options.shortName;
  }
}
