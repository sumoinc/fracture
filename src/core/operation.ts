import { Component } from "projen";
import { deepMerge } from "projen/lib/util";
import { ValueOf } from "type-fest";
import { AccessPattern } from "./access-pattern";
import { Resource } from "./resource";
import { Service } from "./service";
import { Structure, STRUCTURE_TYPE } from "./structure";
import { DynamoCommand, TypescriptOperation } from "../generators";

/******************************************************************************
 * TYPES
 *****************************************************************************/

export type OperationOptions = {
  /**
   * What (generic) type of operation is this?
   * Default: query
   */
  operationType?: ValueOf<typeof OPERATION_TYPE>;
  /**
   * What (more specific) specific type of operation is this?
   * Default: list
   */
  operationSubType?: ValueOf<typeof OPERATION_SUB_TYPE>;
};

export type OperationDefault = {
  operationSubType: ValueOf<typeof OPERATION_SUB_TYPE>;
  default: string;
};

export const OPERATION_TYPE = {
  QUERY: "Query",
  MUTATION: "Mutation",
  SUBSCRIPTION: "Subscription",
} as const;

export const OPERATION_SUB_TYPE = {
  CREATE_ONE: "CreateOne",
  READ_ONE: "ReadOne",
  UPDATE_ONE: "UpdateOne",
  DELETE_ONE: "DeleteOne",
  IMPORT_ONE: "ImportOne",
  LIST: "LIST",
  CREATE_VERSION: "CreateVersion",
  READ_VERSION: "ReadVersion",
} as const;

export class Operation extends Component {
  // member components
  // parents
  public readonly accessPattern: AccessPattern;
  // all other options
  public readonly options: Required<OperationOptions>;
  // private cached properties
  private _inputStructure?: Structure;
  private _outputStructure?: Structure;
  // generators
  public readonly ts: TypescriptOperation;
  public readonly tsDynamoCommand: DynamoCommand;

  constructor(accessPattern: AccessPattern, options: OperationOptions) {
    super(accessPattern.project);

    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     **************************************************************************/

    const defaultOptions: Partial<OperationOptions> = {
      operationType: OPERATION_TYPE.QUERY,
    };

    /***************************************************************************
     *
     * INIT OPERATION
     *
     **************************************************************************/

    // member components

    // parents + inverse
    this.accessPattern = accessPattern;
    this.accessPattern.operations.push(this);
    this.resource.operations.push(this);

    // all other options
    this.options = deepMerge([
      defaultOptions,
      options,
    ]) as Required<OperationOptions>;

    this.project.logger.info(`INFO Operation: "${this.name}"`);

    /***************************************************************************
     *
     * GENERATORS
     *
     **************************************************************************/

    this.ts = new TypescriptOperation(this);
    this.tsDynamoCommand = new DynamoCommand(this);

    return this;
  }

  // public build() {
  //   this.project.logger.info(`BUILD Operation: "${this.name}"`);
  //   this.inputStructure.build();
  //   this.outputStructure.build();
  //   // build generators
  //   this.ts.build();
  //   // this.tsDynamoCommand.build();
  // }

  /**
   * Operation name, based on the naming strategy
   */
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

  public get operationType() {
    return this.options.operationType;
  }

  public get operationSubType() {
    return this.options.operationSubType;
  }

  public get isWrite(): boolean {
    return this.isCreate || this.isUpdate || this.isImport;
  }

  public get isCreate(): boolean {
    return this.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE;
  }

  public get isRead(): boolean {
    return this.operationSubType === OPERATION_SUB_TYPE.READ_ONE;
  }

  public get isUpdate(): boolean {
    return this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE;
  }

  public get isDelete(): boolean {
    return this.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE;
  }

  public get isImport(): boolean {
    return this.operationSubType === OPERATION_SUB_TYPE.IMPORT_ONE;
  }

  /***************************************************************************
   *
   * INPUT / OUTPUT STRUCTURES
   *
   * We lazy load these since all the attributes may not exist on the resource
   * when this component is initially created.
   *
   **************************************************************************/

  public get inputStructure(): Structure {
    if (!this._inputStructure) {
      this._inputStructure = new Structure(this.resource, {
        type: STRUCTURE_TYPE.INPUT,
        operation: this,
      });
    }
    return this._inputStructure;
  }

  public get outputStructure(): Structure {
    if (!this._outputStructure) {
      this._outputStructure = new Structure(this.resource, {
        type: STRUCTURE_TYPE.OUTPUT,
        operation: this,
      });
    }
    return this._outputStructure;
  }

  public get resource(): Resource {
    return this.accessPattern.resource;
  }

  public get service(): Service {
    return this.resource.service;
  }
}
