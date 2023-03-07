import { paramCase } from "change-case";
import { ValueOf } from "type-fest";
import { FractureComponent } from "./component";
import {
  formatStringByNamingStrategy,
  NAMING_STRATEGY_TYPE,
} from "./naming-strategy";
import { Operation, OPERATION_SUB_TYPE } from "./operation";
import { Resource } from "./resource";
import { ResourceAttributeGenerator } from "./resource-attribute";
import { Service } from "./service";
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
  // attributes?: StructureAttribute[];
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
  public readonly resource: Resource;
  public readonly service: Service;
  /**
   * Name for this structure
   */
  public readonly name: string;
  /**
   *  Structure attributes
   */
  // public readonly attributes: StructureAttribute[];
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
    this.resource = operation.resource;
    this.service = operation.service;
    //this.attributes = options.attributes || [];
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
    /*
    if (
      this.operation.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE ||
      this.operation.operationSubType === OPERATION_SUB_TYPE.CREATE_MANY
    ) {
      if (this.type === STRUCTURE_TYPE.INPUT) {
        this.addDataAttributes();
      } else if (this.type === STRUCTURE_TYPE.OUTPUT) {
        this.addPartitionKeyAttributes();
      }
    }*/

    /***************************************************************************
     * READ
     **************************************************************************/
    /*
    if (
      this.operation.operationSubType === OPERATION_SUB_TYPE.READ_ONE ||
      this.operation.operationSubType === OPERATION_SUB_TYPE.READ_MANY
    ) {
      if (this.type === STRUCTURE_TYPE.INPUT) {
        this.addPartitionKeyAttributes();
      } else if (this.type === STRUCTURE_TYPE.OUTPUT) {
        this.addAllAttributes();
      }
    }*/

    /***************************************************************************
     * UPDATE
     **************************************************************************/
    /*if (
      this.operation.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE ||
      this.operation.operationSubType === OPERATION_SUB_TYPE.UPDATE_MANY
    ) {
      if (this.type === STRUCTURE_TYPE.INPUT) {
        this.addPartitionKeyAttributes();
      } else if (this.type === STRUCTURE_TYPE.OUTPUT) {
        this.addAllAttributes();
      }
    }*/

    /***************************************************************************
     * DELETE
     **************************************************************************/
    /*
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
    */

    /***************************************************************************
     * IMPORT
     **************************************************************************/
    /*
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
    */
  }

  public get interfaceName() {
    return formatStringByNamingStrategy(
      this.name,
      NAMING_STRATEGY_TYPE.PASCAL_CASE
    );
  }

  public get publicAttributes() {
    switch (this.type) {
      case STRUCTURE_TYPE.INPUT:
        switch (this.operation.operationSubType) {
          case OPERATION_SUB_TYPE.CREATE_ONE:
          case OPERATION_SUB_TYPE.CREATE_MANY:
            return this.dataAttributes;
          case OPERATION_SUB_TYPE.READ_ONE:
          case OPERATION_SUB_TYPE.READ_MANY:
            return this.dataAttributes;
          case OPERATION_SUB_TYPE.UPDATE_ONE:
          case OPERATION_SUB_TYPE.UPDATE_MANY:
            return this.dataAttributes;
          case OPERATION_SUB_TYPE.DELETE_ONE:
          case OPERATION_SUB_TYPE.DELETE_MANY:
            return this.dataAttributes;
          case OPERATION_SUB_TYPE.IMPORT_ONE:
          case OPERATION_SUB_TYPE.IMPORT_MANY:
            return this.dataAttributes;
          default:
            throw new Error(
              `Unknown operation sub-type ${this.operation.operationSubType}`
            );
        }

      case STRUCTURE_TYPE.OUTPUT:
        switch (this.operation.operationSubType) {
          case OPERATION_SUB_TYPE.CREATE_ONE:
          case OPERATION_SUB_TYPE.CREATE_MANY:
            return this.allAttributes;
          case OPERATION_SUB_TYPE.READ_ONE:
          case OPERATION_SUB_TYPE.READ_MANY:
            return this.allAttributes;
          case OPERATION_SUB_TYPE.UPDATE_ONE:
          case OPERATION_SUB_TYPE.UPDATE_MANY:
            return this.allAttributes;
          case OPERATION_SUB_TYPE.DELETE_ONE:
          case OPERATION_SUB_TYPE.DELETE_MANY:
            return this.allAttributes;
          case OPERATION_SUB_TYPE.IMPORT_ONE:
          case OPERATION_SUB_TYPE.IMPORT_MANY:
            return this.allAttributes;
          default:
            throw new Error(
              `Unknown operation sub-type ${this.operation.operationSubType}`
            );
        }

      default:
        throw new Error(`Unknown structure type ${this.type}`);
    }
  }

  /**
   * includes all public attributes, plus generated attributes.
   * This is a good list for dynamodb operations.
   */
  public get privateAttributes() {
    return this.generatedAttributes.concat(this.publicAttributes);
  }

  public get generatedAttributes() {
    return this.operation.generatedAttributes.map((attribute) => {
      return new StructureAttribute(this, {
        name: attribute.name,
      });
    });
  }

  public get partitionKeyAttributes() {
    return this.resource.partitionKeyAttributes.map((attribute) => {
      return new StructureAttribute(this, {
        name: attribute.name,
      });
    });
  }

  public get dataAttributes() {
    return this.resource.dataAttributes.map((attribute) => {
      return new StructureAttribute(this, {
        name: attribute.name,
      });
    });
  }
  public get allAttributes() {
    return this.resource.attributes.map((attribute) => {
      return new StructureAttribute(this, {
        name: attribute.name,
      });
    });
  }

  public hasAttributeGenerator(
    generator: ValueOf<typeof ResourceAttributeGenerator>
  ): boolean {
    return this.generatedAttributes.some((attribute) => {
      return (
        attribute.resourceAttribute.generatorForOperation(this.operation) ===
        generator
      );
    });
  }
}
