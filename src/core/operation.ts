import { deepMerge } from "projen/lib/util";
import { ValueOf } from "type-fest";
import { AccessPattern } from "./access-pattern";
import { FractureComponent } from "./component";
import { Resource } from "./resource";
import { Service } from "./service";
import { Structure, STRUCTURE_TYPE } from "./structure";

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
} as const;

export class Operation extends FractureComponent {
  // member components
  // parents
  public readonly accessPattern: AccessPattern;
  // all other options
  public readonly options: Required<OperationOptions>;
  // private cached properties
  private _inputStructure?: Structure;
  private _outputStructure?: Structure;

  constructor(accessPattern: AccessPattern, options: OperationOptions) {
    super(accessPattern.fracture);

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
    this.resource.operations.push(this);

    // all other options
    this.options = deepMerge([
      defaultOptions,
      options,
    ]) as Required<OperationOptions>;
    return this;
  }

  public build() {
    this.inputStructure.build();
    this.outputStructure.build();
  }

  /**
   * Operation name, based on the naming strategy
   */
  public get name() {
    const resourceName = this.resource.name;
    const prefix =
      this.fracture.options.namingStrategy.operations.prefixes[
        this.options.operationSubType
      ];
    const suffix =
      this.fracture.options.namingStrategy.operations.suffixes[
        this.options.operationSubType
      ];

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
    return this.options.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE;
  }

  public get isRead(): boolean {
    return this.options.operationSubType === OPERATION_SUB_TYPE.READ_ONE;
  }

  public get isUpdate(): boolean {
    return this.options.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE;
  }

  public get isDelete(): boolean {
    return this.options.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE;
  }

  public get isImport(): boolean {
    return this.options.operationSubType === OPERATION_SUB_TYPE.IMPORT_ONE;
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
