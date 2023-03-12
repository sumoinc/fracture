import { Attribute, AttributeOptions } from "./attribute";
import { Structure } from "./structure";

/******************************************************************************
 * TYPES
 *****************************************************************************/

export interface StructureAttributeOptions extends AttributeOptions {}

/******************************************************************************
 * CLASS
 *****************************************************************************/

export class StructureAttribute extends Attribute {
  // member components
  // parent
  public readonly structure: Structure;
  // all other options

  constructor(
    structure: Structure,
    options: Required<StructureAttributeOptions>
  ) {
    super(structure.resource, JSON.parse(JSON.stringify(options)));

    // parents + inverse
    this.structure = structure;
  }
}
