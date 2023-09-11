import { paramCase } from "change-case";
import { Component } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { ValueOf } from "type-fest";
import {
  ResourceAttribute,
  ResourceAttributeGenerator,
} from "./resource-attribute";
import { Service } from "./service";
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
   * Returns all structures for service
   */
  public static all(project: TypeScriptProject): Array<Operation> {
    const isDefined = (c: Component): c is Operation => c instanceof Operation;
    return project.components.filter(isDefined);
  }

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
  public structures: Array<Structure> = [];

  constructor(public readonly project: Service, options: OperationOptions) {
    super(project);

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
    const structure = new Structure(this.project, options);
    this.structures.push(structure);
    return structure;
  }

  public addInputAttribute(
    attribute: ResourceAttribute,
    options: Partial<StructureAttributeOptions> = {}
  ) {
    // apply any generators?
    const generator =
      this.operationSubType === OperationSubType.CREATE_ONE
        ? attribute.createGenerator
        : this.operationSubType === OperationSubType.READ_ONE
        ? attribute.readGenerator
        : this.operationSubType === OperationSubType.UPDATE_ONE
        ? attribute.updateGenerator
        : this.operationSubType === OperationSubType.DELETE_ONE
        ? attribute.deleteGenerator
        : ResourceAttributeGenerator.NONE;

    return this.inputStructure.addAttribute({
      name: attribute.name,
      shortName: attribute.shortName,
      type: attribute.type,
      typeParameter: attribute.typeParameter,
      comments: attribute.comments,
      required: true,
      generator,
      ...options,
    });
  }

  public addOutputAttribute(
    attribute: ResourceAttribute,
    options: Partial<StructureAttributeOptions> = {}
  ) {
    return this.outputStructure.addAttribute({
      name: attribute.name,
      shortName: attribute.shortName,
      type: attribute.type,
      typeParameter: attribute.typeParameter,
      comments: attribute.comments,
      required: true,
      ...options,
    });
  }
}
