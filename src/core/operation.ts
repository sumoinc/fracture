import { paramCase } from "change-case";
import { ValueOf } from "type-fest";
import { FractureComponent } from "./component";
import { Resource } from "./resource";
import { Structure, STRUCTURE_TYPE } from "./structure";

/******************************************************************************
 * TYPES
 *****************************************************************************/

export type OperationOptions = {
  /**
   * Name for this operation
   */
  name?: string;
  /**
   *  What input shape should we expect to see?
   */
  inputStructure?: Structure;
  /**
   *  What output shape do we expect to see here?
   */
  outputStructure?: Structure;
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
  IMPORT_ONE: "ImportOne",
  IMPORT_MANY: "ImportMany",
  CREATE_ONE: "CreateOne",
  CREATE_MANY: "CreateMany",
  READ_ONE: "ReadOne",
  READ_MANY: "ReadMany", // aka: list
  UPDATE_ONE: "UpdateOne",
  UPDATE_MANY: "UpdateMany",
  DELETE_ONE: "DeleteOne",
  DELETE_MANY: "DeleteMany",
} as const;

export class Operation extends FractureComponent {
  public readonly resource: Resource;
  /**
   * Name for this operation
   */
  public readonly name: string;
  /**
   *  What input shape should we expect to see?
   */
  public readonly inputStructure: Structure;
  /**
   *  What output shape do we expect to see here?
   */
  public readonly outputStructure: Structure;
  /**
   * What (generic) type of operation is this?
   * Default: QUERY
   */
  public readonly operationType: ValueOf<typeof OPERATION_TYPE>;
  /**
   * What (more specific) specific type of operation is this?
   * Default: GET_MANY
   */
  public readonly operationSubType: ValueOf<typeof OPERATION_SUB_TYPE>;
  /**
   * Is this a batch operation?
   */
  public readonly isBatch: boolean;
  /**
   *  What is the verb used to describe this operation?
   *  (get, update, delete)
   */
  public readonly operationVerb: string;

  constructor(resource: Resource, options: OperationOptions) {
    super(resource.fracture);

    // set option values
    this.resource = resource;
    this.operationType = options?.operationType
      ? options.operationType
      : OPERATION_TYPE.QUERY;
    this.operationSubType = options?.operationSubType
      ? options.operationSubType
      : OPERATION_SUB_TYPE.READ_MANY;
    this.isBatch =
      this.operationSubType === OPERATION_SUB_TYPE.IMPORT_MANY ||
      this.operationSubType === OPERATION_SUB_TYPE.CREATE_MANY ||
      this.operationSubType === OPERATION_SUB_TYPE.READ_MANY ||
      this.operationSubType === OPERATION_SUB_TYPE.UPDATE_MANY ||
      this.operationSubType === OPERATION_SUB_TYPE.DELETE_MANY;

    this.operationVerb =
      this.operationSubType === OPERATION_SUB_TYPE.IMPORT_ONE ||
      this.operationSubType === OPERATION_SUB_TYPE.IMPORT_MANY
        ? "import"
        : this.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE ||
          this.operationSubType === OPERATION_SUB_TYPE.CREATE_MANY
        ? "create"
        : this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE ||
          this.operationSubType === OPERATION_SUB_TYPE.UPDATE_MANY
        ? "update"
        : this.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE ||
          this.operationSubType === OPERATION_SUB_TYPE.DELETE_MANY
        ? "delete"
        : "read";

    /**
     * Create name for this operation, if not provided
     */
    this.name = options.name
      ? paramCase(options.name)
      : paramCase(
          `${this.operationVerb}-${this.isBatch ? "batch" : ""}-${
            this.resource.name
          }`
        );

    this.inputStructure =
      options.inputStructure ||
      new Structure(this, { type: STRUCTURE_TYPE.INPUT });

    this.outputStructure =
      options.outputStructure ||
      new Structure(this, { type: STRUCTURE_TYPE.OUTPUT });
  }
}
