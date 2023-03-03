import { paramCase } from "change-case";
import { ValueOf } from "type-fest";
import { FractureComponent } from "./component";
import {
  formatStringByNamingStrategy,
  NAMING_STRATEGY_TYPE,
} from "./naming-strategy";
import { Operation, OPERATION_SUB_TYPE } from "./operation";
import { StructureAttribute } from "./structure-attribute";

/******************************************************************************
 * TYPES
 *****************************************************************************/

export type StructureOptions = {
  /**
   * Name for this structure
   */
  name?: string;
  /**
   *  Values to be added to structure
   */
  attributes?: StructureAttribute[];
  /**
   *  Type of structure
   */
  type?: ValueOf<typeof STRUCTURE_TYPE>;
  /**
   * Suffic for this structure's name
   */
  suffix?: string;
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
  public readonly operation: Operation;
  /**
   * Name for this structure
   */
  public readonly name: string;
  /**
   *  Structure attributes
   */
  public readonly attributes: StructureAttribute[];
  /**
   *  Type of structure
   */
  public readonly type: ValueOf<typeof STRUCTURE_TYPE>;
  /**
   * Suffic for this structure's name
   */
  public readonly suffix: string;

  constructor(operation: Operation, options: StructureOptions) {
    super(operation.fracture);

    this.operation = operation;
    this.attributes = options.attributes || [];
    this.type = options.type || STRUCTURE_TYPE.DATA;
    this.suffix =
      this.type === STRUCTURE_TYPE.INPUT
        ? "input"
        : this.type === STRUCTURE_TYPE.OUTPUT
        ? "output"
        : "";
    this.name = options.name
      ? paramCase(options.name)
      : paramCase(this.operation.name) + "-" + this.suffix;

    /***************************************************************************
     * CREATE ONE
     **************************************************************************/
    if (
      this.operation.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE ||
      this.operation.operationSubType === OPERATION_SUB_TYPE.CREATE_MANY
    ) {
      if (this.type === STRUCTURE_TYPE.INPUT) {
        this.addDataAttributes();
      } else if (this.type === STRUCTURE_TYPE.OUTPUT) {
        this.addPartitionKeyAttributes();
      }
    }

    /***************************************************************************
     * READ
     **************************************************************************/
    if (
      this.operation.operationSubType === OPERATION_SUB_TYPE.READ_ONE ||
      this.operation.operationSubType === OPERATION_SUB_TYPE.READ_MANY
    ) {
      if (this.type === STRUCTURE_TYPE.INPUT) {
        this.addPartitionKeyAttributes();
      } else if (this.type === STRUCTURE_TYPE.OUTPUT) {
        this.addAllAttributes();
      }
    }

    /***************************************************************************
     * UPDATE
     **************************************************************************/
    if (
      this.operation.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE ||
      this.operation.operationSubType === OPERATION_SUB_TYPE.UPDATE_MANY
    ) {
      if (this.type === STRUCTURE_TYPE.INPUT) {
        this.addPartitionKeyAttributes();
      } else if (this.type === STRUCTURE_TYPE.OUTPUT) {
        this.addAllAttributes();
      }
    }

    /***************************************************************************
     * DELETE
     **************************************************************************/
    if (
      this.operation.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE ||
      this.operation.operationSubType === OPERATION_SUB_TYPE.DELETE_MANY
    ) {
      if (this.type === STRUCTURE_TYPE.INPUT) {
        this.addPartitionKeyAttributes();
      } else if (this.type === STRUCTURE_TYPE.OUTPUT) {
        this.addAllAttributes();
      }
    }

    /***************************************************************************
     * IMPORT
     **************************************************************************/
    if (
      this.operation.operationSubType === OPERATION_SUB_TYPE.IMPORT_ONE ||
      this.operation.operationSubType === OPERATION_SUB_TYPE.IMPORT_MANY
    ) {
      if (this.type === STRUCTURE_TYPE.INPUT) {
        this.addPartitionKeyAttributes();
      } else if (this.type === STRUCTURE_TYPE.OUTPUT) {
        this.addAllAttributes();
      }
    }
  }

  public get interfaceName() {
    return formatStringByNamingStrategy(
      this.name,
      NAMING_STRATEGY_TYPE.PASCAL_CASE
    );
  }

  addPartitionKeyAttributes = () => {
    this.operation.resource.partitionKeyAttributes.forEach((attribute) => {
      this.attributes.push(
        new StructureAttribute(this, {
          name: attribute.name,
        })
      );
    });
  };

  addDataAttributes = () => {
    this.operation.resource.dataAttributes.forEach((attribute) => {
      this.attributes.push(
        new StructureAttribute(this, {
          name: attribute.name,
        })
      );
    });
  };

  addAllAttributes = () => {
    this.operation.resource.attributes.forEach((attribute) => {
      this.attributes.push(
        new StructureAttribute(this, {
          name: attribute.name,
        })
      );
    });
  };
}
