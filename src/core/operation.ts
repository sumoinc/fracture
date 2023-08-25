import { paramCase } from "change-case";
import { Component } from "projen";
import { ValueOf } from "type-fest";
import { FractureService } from "./fracture-service";
import { Structure, StructureOptions } from "./structure";
import { StructureAttributeOptions } from "./structure-attribute";
import { DynamoGsi } from "../dynamodb";

/******************************************************************************
 * TYPES
 *****************************************************************************/

export const OperationType = {
  QUERY: "Query",
  MUTATION: "Mutation",
  SUBSCRIPTION: "Subscription",
} as const;

export const OperationSubType = {
  CREATE_ONE: "CreateOne",
  READ_ONE: "ReadOne",
  UPDATE_ONE: "UpdateOne",
  DELETE_ONE: "DeleteOne",
  IMPORT_ONE: "ImportOne",
  LIST: "LIST",
  CREATE_VERSION: "CreateVersion",
  READ_VERSION: "ReadVersion",
} as const;

export type OperationOptions = {
  /**
   * Name for this operation.
   */
  name: string;
  /**
   * Global secondary index used in this operation. This might also be the
   * primary PK and SK index.
   */
  dynamoGsi: DynamoGsi;
  /**
   * What (generic) type of operation is this?
   * Default: query
   */
  operationType?: ValueOf<typeof OperationType>;
  /**
   * What (more specific) specific type of operation is this?
   * Default: list
   */
  operationSubType?: ValueOf<typeof OperationSubType>;
  inputAttributeOptions?: Array<StructureAttributeOptions>;
  outputAttributeOptions?: Array<StructureAttributeOptions>;
};

export class Operation extends Component {
  /**
   * Name for this operation.
   */
  public readonly name: string;
  /**
   * Global secondary index used in this operation. This might also be the
   * primary PK and SK index.
   */
  public readonly dynamoGsi: DynamoGsi;
  /**
   * What (generic) type of operation is this?
   * Default: query
   */
  public readonly operationType: ValueOf<typeof OperationType>;
  /**
   * What (more specific) specific type of operation is this?
   * Default: list
   */
  public readonly operationSubType: ValueOf<typeof OperationSubType>;
  public readonly inputStructure: Structure;
  public readonly outputStructure: Structure;
  /**
   * All structures for this resource.
   */
  public structures: Structure[] = [];

  constructor(service: FractureService, options: OperationOptions) {
    super(service);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = paramCase(options.name);
    this.dynamoGsi = options.dynamoGsi;
    this.operationSubType = options.operationSubType || OperationSubType.LIST;
    this.operationType = options.operationType || OperationType.QUERY;

    /***************************************************************************
     * Initialize data structures
     **************************************************************************/

    this.inputStructure = this.addStructure({
      name: `${this.name}-input`,
      attributeOptions: options.inputAttributeOptions ?? [],
    });

    this.outputStructure = this.addStructure({
      name: `${this.name}-output`,
      attributeOptions: options.outputAttributeOptions ?? [],
    });

    return this;
  }

  public addStructure(options: StructureOptions) {
    const service = this.project as FractureService;
    const structure = new Structure(service, options);
    this.structures.push(structure);
    return structure;
  }

  /**
   * Operation name, based on the naming strategy
   */
  /*
  public get name() {
    const resourceName =
      this.operationSubType === OPERATION_SUB_TYPE.LIST
        ? this.resource.pluralName
        : this.resource.name;
    const prefix =
      this.service.namingStrategy.operations.prefixes[this.operationSubType];
    const suffix =
      this.service.namingStrategy.operations.suffixes[this.operationSubType];

    return [prefix, resourceName, suffix]
      .filter((part) => part.length > 0)
      .join("-");
  }
  */

  // public get operationType() {
  //   return this.options.operationType;
  // }

  // public get operationSubType() {
  //   return this.options.operationSubType;
  // }

  // public get isWrite(): boolean {
  //   return this.isCreate || this.isUpdate || this.isImport;
  // }

  // public get isCreate(): boolean {
  //   return this.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE;
  // }

  // public get isRead(): boolean {
  //   return this.operationSubType === OPERATION_SUB_TYPE.READ_ONE;
  // }

  // public get isUpdate(): boolean {
  //   return this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE;
  // }

  // public get isDelete(): boolean {
  //   return this.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE;
  // }

  // public get isImport(): boolean {
  //   return this.operationSubType === OPERATION_SUB_TYPE.IMPORT_ONE;
  // }

  /***************************************************************************
   *
   * INPUT / OUTPUT STRUCTURES
   *
   * We lazy load these since all the attributes may not exist on the resource
   * when this component is initially created.
   *
   **************************************************************************/

  // public get inputStructure(): Structure {
  //   if (!this._inputStructure) {
  //     this._inputStructure = new Structure(this.resource, {
  //       type: STRUCTURE_TYPE.INPUT,
  //       operation: this,
  //     });
  //   }
  //   return this._inputStructure;
  // }

  // public get outputStructure(): Structure {
  //   if (!this._outputStructure) {
  //     this._outputStructure = new Structure(this.resource, {
  //       type: STRUCTURE_TYPE.OUTPUT,
  //       operation: this,
  //     });
  //   }
  //   return this._outputStructure;
  // }

  // public get resource(): Resource {
  //   return this.accessPattern.resource;
  // }

  /*
  public get service(): Service {
    return this.resource.service;
  }
  */

  /*****************************************************************************
   *
   *  TYPESCRIPT HELPERS
   *
   ****************************************************************************/

  /*
  public get tsResponseTypeName() {
    return this.operationSubType === OPERATION_SUB_TYPE.LIST
      ? this.service.tsLlistResponseTypeName
      : this.service.tsResponseTypeName;
  }
  */
}
