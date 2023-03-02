import { paramCase } from "change-case";
import { FractureComponent } from "./component";
import { ResourceAttribute } from "./resource-attribute";
import { Structure } from "./structure";

/******************************************************************************
 * TYPES
 *****************************************************************************/

export type StructureAttributeOptions = {
  /**
   * Name for this structure
   */
  name: string;
  /**
   *  Is this attribute required?
   */
  isRequired?: boolean;
};

/******************************************************************************
 * CLASS
 *****************************************************************************/

export class StructureAttribute extends FractureComponent {
  public readonly structure: Structure;
  /**
   * Name for this structure
   */
  public readonly name: string;
  /**
   *  Is this attribute required?
   */
  public readonly isRequired?: boolean;

  constructor(structure: Structure, options: StructureAttributeOptions) {
    super(structure.fracture);
    this.structure = structure;
    this.name = paramCase(options.name);
    this.isRequired = options.isRequired || false;
  }

  /**
   * Get origin resource attribute.
   */
  public get resourceAttribute(): ResourceAttribute {
    const resourceAttribute =
      this.structure.operation.resource.attributes.filter(
        (a) => a.name === this.name
      );
    return resourceAttribute[0];
  }
}
