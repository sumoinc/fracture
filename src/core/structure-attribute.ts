import { Attribute, AttributeGenerator, AttributeOptions } from "./attribute";
import { Operation, OPERATION_SUB_TYPE } from "./operation";
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

    // TODO: find way to get sources from attribute copied over

    return this;
  }

  public get isGenerated(): boolean {
    // not generated under any circumstances
    if (
      this.operation === undefined ||
      this.options.generator === AttributeGenerator.NONE
    ) {
      return false;
    }

    // generated depending on operation type
    switch (this.operation.operationSubType) {
      case OPERATION_SUB_TYPE.CREATE_ONE:
        return this.isGeneratedOnCreate;
      case OPERATION_SUB_TYPE.READ_ONE:
        return this.isGeneratedOnRead;
      case OPERATION_SUB_TYPE.UPDATE_ONE:
        return this.isGeneratedOnUpdate;
      case OPERATION_SUB_TYPE.DELETE_ONE:
        return this.isGeneratedOnDelete;
      default:
        return false;
    }
  }

  /*****************************************************************************
   *
   *  UPSTREAM HELPERS
   *
   ****************************************************************************/

  public get operation(): Operation | undefined {
    return this.structure.operation;
  }
}
