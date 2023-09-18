import { paramCase } from "change-case";
import { Component } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { ValueOf } from "type-fest";
import { DataService } from "./data-service";
import { Resource } from "./resource";
import {
  IdentifierType,
  ManagementType,
  ResourceAttribute,
  ResourceAttributeGenerator,
  ResourceAttributeType,
} from "./resource-attribute";
import { Structure, StructureOptions } from "./structure";
import {
  StructureAttribute,
  StructureAttributeOptions,
} from "./structure-attribute";
import { DynamoGsi, DynamoTable } from "../dynamodb";

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
   *  Resource this structure belongs to.
   */
  readonly resource: Resource;

  /**
   * Name for this operation.
   */
  readonly name: string;

  /**
   * Global secondary index used in this operation. This might also be the
   * primary PK and SK index.
   *
   * @default - keyGsi (aka: no index)
   */
  readonly dynamoGsi?: DynamoGsi;

  /**
   * What (generic) type of operation is this?
   * Default: query
   */
  readonly operationType?: ValueOf<typeof OperationType>;

  /**
   * What (more specific) specific type of operation is this?
   * Default: list
   */
  readonly operationSubType?: ValueOf<typeof OperationSubType>;
  readonly inputAttributeOptions?: Array<StructureAttributeOptions>;
  //readonly outputAttributeOptions?: Array<StructureAttributeOptions>;
};

export class Operation extends Component {
  /**
   * Returns an attribute by name, or undefined if it doesn't exist
   */
  public static byName(
    resource: Resource,
    name: string
  ): Operation | undefined {
    const isDefined = (c: Component): c is Operation =>
      c instanceof Operation && c.name === name;
    return resource.operations.find(isDefined);
  }

  /**
   * Returns all structures for service
   */
  public static all(project: TypeScriptProject): Array<Operation> {
    const isDefined = (c: Component): c is Operation => c instanceof Operation;
    return project.components.filter(isDefined);
  }

  /**
   * Adds a create operation to the provided resource or returns existing
   * operation, if it exists
   */
  public static create(resource: Resource, name?: string): Operation {
    // does one exist al;ready?
    const isDefined = (c: Component): c is Operation =>
      c instanceof Operation &&
      c.operationSubType === OperationSubType.CREATE_ONE &&
      c.name === name;
    const foundOperation = resource.operations.find(isDefined);
    if (foundOperation) {
      return foundOperation;
    }

    // create one, then return it
    const operationName = name || `create-${resource.name}`;
    const o = new Operation(resource.service, {
      name: operationName,
      resource,
      operationType: OperationType.MUTATION,
      operationSubType: OperationSubType.CREATE_ONE,
      dynamoGsi: DynamoTable.of(resource.project).keyGsi,
    });

    resource.attributes.forEach((attribute) => {
      // all identifiers are required
      if (attribute.identifier === IdentifierType.PRIMARY) {
        o.addInputAttribute(attribute);
      }
      // add all user namaged attributes
      if (
        attribute.management === ManagementType.USER_MANAGED &&
        attribute.type !== ResourceAttributeType.ARRAY &&
        attribute.type !== ResourceAttributeType.MAP
      ) {
        o.addInputAttribute(attribute);
      }
    });

    return o;
  }

  /**
   * Adds a read operation to the provided resource or returns existing
   * operation, if it exists
   */
  public static read(resource: Resource, name?: string): Operation {
    // does one exist al;ready?
    const isDefined = (c: Component): c is Operation =>
      c instanceof Operation &&
      c.operationSubType === OperationSubType.READ_ONE &&
      c.name === name;
    const foundOperation = resource.operations.find(isDefined);
    if (foundOperation) {
      return foundOperation;
    }

    // create one, then return it
    const operationName = name || `get-${resource.name}`;
    const o = new Operation(resource.service, {
      name: operationName,
      resource,
      operationType: OperationType.QUERY,
      operationSubType: OperationSubType.READ_ONE,
      dynamoGsi: DynamoTable.of(resource.project).keyGsi,
    });

    resource.attributes.forEach((attribute) => {
      // all identifiers are required
      if (attribute.identifier === IdentifierType.PRIMARY) {
        o.addInputAttribute(attribute);
      }
    });

    return o;
  }

  /**
   * Adds a update operation to the provided resource or returns existing
   * operation, if it exists
   */
  public static update(resource: Resource, name?: string): Operation {
    // does one exist al;ready?
    const isDefined = (c: Component): c is Operation =>
      c instanceof Operation &&
      c.operationSubType === OperationSubType.UPDATE_ONE &&
      c.name === name;
    const foundOperation = resource.operations.find(isDefined);
    if (foundOperation) {
      return foundOperation;
    }

    // create one, then return it
    const operationName = name || `get-${resource.name}`;
    const o = new Operation(resource.service, {
      name: operationName,
      resource,
      operationType: OperationType.QUERY,
      operationSubType: OperationSubType.READ_ONE,
      dynamoGsi: DynamoTable.of(resource.project).keyGsi,
    });

    resource.attributes.forEach((attribute) => {
      // all identifiers are required
      if (attribute.identifier === IdentifierType.PRIMARY) {
        o.addInputAttribute(attribute);
      }
      // add all user namaged attributes
      if (
        attribute.management === ManagementType.USER_MANAGED &&
        attribute.type !== ResourceAttributeType.ARRAY &&
        attribute.type !== ResourceAttributeType.MAP
      ) {
        o.addInputAttribute(attribute, {
          required: false,
        });
      }
    });

    return o;
  }

  /**
   * Adds a delete operation to the provided resource or returns existing
   * operation, if it exists
   */
  public static delete(resource: Resource, name?: string): Operation {
    // does one exist al;ready?
    const isDefined = (c: Component): c is Operation =>
      c instanceof Operation &&
      c.operationSubType === OperationSubType.DELETE_ONE &&
      c.name === name;
    const foundOperation = resource.operations.find(isDefined);
    if (foundOperation) {
      return foundOperation;
    }

    // create one, then return it
    const operationName = name || `get-${resource.name}`;
    const o = new Operation(resource.service, {
      name: operationName,
      resource,
      operationType: OperationType.QUERY,
      operationSubType: OperationSubType.READ_ONE,
      dynamoGsi: DynamoTable.of(resource.project).keyGsi,
    });

    resource.attributes.forEach((attribute) => {
      // all identifiers are required
      if (attribute.identifier === IdentifierType.PRIMARY) {
        o.addInputAttribute(attribute);
      }
    });

    return o;
  }

  /**
   *  Resource this structure belongs to.
   */
  public readonly resource: Resource;

  /**
   * Name for this operation.
   */
  public readonly name: string;

  /**
   * Global secondary index used in this operation. This might also be the
   * primary PK and SK index.
   *
   *  @default - keyGsi (aka: no index)
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
  public readonly outputAttribute: StructureAttribute;

  /**
   * All structures for this resource.
   */
  public structures: Array<Structure> = [];

  constructor(public readonly project: DataService, options: OperationOptions) {
    super(project);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.resource = options.resource;
    this.name = paramCase(options.name);
    (this.dynamoGsi = options.dynamoGsi || DynamoTable.of(this.service).keyGsi),
      (this.operationSubType =
        options.operationSubType || OperationSubType.LIST);
    this.operationType = options.operationType || OperationType.QUERY;

    /***************************************************************************
     * Initialize data structures
     **************************************************************************/

    this.inputStructure = this.addStructure({
      name: `${this.name}-input`,
      attributeOptions: options.inputAttributeOptions ?? [],
    });

    this.outputAttribute = new StructureAttribute(this.project, {
      name: this.resource.name,
      shortName: this.resource.shortName,
      type: this.resource.name,
    });

    /*
    this.outputStructure = this.addStructure({
      name: `${this.name}-output`,
      attributeOptions: options.outputAttributeOptions ?? [],
    });

    */

    /***************************************************************************
     * Add to Resource
     **************************************************************************/

    if (Operation.byName(this.resource, this.name)) {
      throw new Error(
        `Resource "${this.resource.name}" already has an operation named "${this.name}"`
      );
    }

    this.resource.operations.push(this);

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
      required: attribute.required,
      generator,
      ...options,
    });
  }

  public get service() {
    return this.project;
  }

  /***************************************************************************
   * Configuration export for this operation
   **************************************************************************/

  public config(): Record<string, any> {
    return {
      name: this.name,
      dynamoGsi: this.dynamoGsi,
      operationType: this.operationType,
      operationSubType: this.operationSubType,
      inputStructure: this.inputStructure.config(),
      outputAttribute: this.outputAttribute.config(),
    };
  }
}
