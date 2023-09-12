import { paramCase } from "change-case";
import { Component } from "projen";
import { DataService } from "./data-service";
import {
  Operation,
  OperationOptions,
  OperationSubType,
  OperationType,
} from "./operation";
import {
  IdentifierType,
  ManagementType,
  ResourceAttribute,
  ResourceAttributeGenerator,
  ResourceAttributeOptions,
  ResourceAttributeType,
  VisabilityType,
} from "./resource-attribute";
import { Structure, StructureOptions } from "./structure";
import { DynamoTable } from "../dynamodb";

export interface ResourceOptions {
  /**
   *  Name for the Resource.
   */
  name: string;

  /**
   * Short name for the Resource.
   */
  shortName?: string;

  /**
   * Plural name for the Resource.
   */
  pluralName?: string;

  /**
   * Comment lines to add to the Resource.
   * @default []
   */
  comments?: string[];

  /**
   * Options for attributes to add when initializing the resource.
   */
  attributeOptions?: Omit<ResourceAttributeOptions, "resource">[];
}

export class Resource extends Component {
  /**
   *  Name for the Resource.
   */
  public readonly name: string;

  /**
   * Short name for the Resource.
   */
  public readonly shortName: string;

  /**
   * Plural name for the Resource.
   */
  public readonly pluralName: string;

  /**
   * Comment lines to add to the Resource.
   *
   * @default []
   */
  public comments: string[];

  /**
   * Primary key for this resource.
   */
  public pk: ResourceAttribute;

  /**
   * Sort key for this resource.
   */
  public sk: ResourceAttribute;

  /**
   * Lookup key for this resource.
   */
  public idx: ResourceAttribute;

  /**
   * Id key for this resource.
   */
  public id: ResourceAttribute;
  public type: ResourceAttribute;
  public version: ResourceAttribute;
  public dateCreated: ResourceAttribute;
  public dateModified: ResourceAttribute;
  public dateDeleted: ResourceAttribute;

  /**
   * All attributes for this resource.
   */
  public attributes: ResourceAttribute[] = [];

  /**
   * Public facing data structure using full attributes names.
   * Excludes hidden attributes.
   */
  public publicDataStructure: Structure;

  /**
   * Entire private data structure using shortnames.
   * Includes all attributes, including hidden ones.
   * This data shape is that unmarchalled data in dynamo looks like and can be
   * used within internal messaging like SQS and EventBus.
   */
  public privateDataStructure: Structure;

  /**
   * All structures for this resource.
   */
  public structures: Structure[] = [];
  public createOperation: Operation;
  public readOperation: Operation;
  public updateOperation: Operation;
  public deleteOperation: Operation;

  /**
   * All operations for this resource.
   */
  public operations: Operation[] = [];

  constructor(public readonly project: DataService, options: ResourceOptions) {
    super(project);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = paramCase(options.name);
    this.shortName = options.shortName
      ? paramCase(options.shortName)
      : this.name;
    this.pluralName = options.pluralName
      ? paramCase(options.pluralName)
      : options.name + "s";
    this.comments = options.comments ?? [];

    /***************************************************************************
     * Initialize data structures
     **************************************************************************/

    this.publicDataStructure = this.addStructure({
      name: `${this.name}`,
      comments: [`Public facing data structure for this record.`],
    });

    this.privateDataStructure = this.addStructure({
      name: `${this.name}-data`,
      comments: [
        `Private data structure for this record.`,
        `Used internally in Dynamo, SQS and other native services.`,
      ],
    });

    /***************************************************************************
     * Operations
     **************************************************************************/

    // Create
    this.createOperation = this.addOperation({
      name: `create-${this.name}`,
      dynamoGsi: DynamoTable.of(this.project).keyGsi,
      operationType: OperationType.MUTATION,
      operationSubType: OperationSubType.CREATE_ONE,
    });

    // Read
    this.readOperation = this.addOperation({
      name: `get-${this.name}`,
      dynamoGsi: DynamoTable.of(this.project).keyGsi,
      operationType: OperationType.QUERY,
      operationSubType: OperationSubType.READ_ONE,
    });

    // Update
    this.updateOperation = this.addOperation({
      name: `update-${this.name}`,
      dynamoGsi: DynamoTable.of(this.project).keyGsi,
      operationType: OperationType.MUTATION,
      operationSubType: OperationSubType.UPDATE_ONE,
    });

    // Delete
    this.deleteOperation = this.addOperation({
      name: `delete-${this.name}`,
      dynamoGsi: DynamoTable.of(this.project).keyGsi,
      operationType: OperationType.MUTATION,
      operationSubType: OperationSubType.DELETE_ONE,
    });

    /***************************************************************************
     * PArtition and Sort Key
     **************************************************************************/

    this.pk = this.addAttribute({
      name: DynamoTable.of(this.project).pk.name,
      comments: [`Partition Key for this record.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.HIDDEN,
      generator: ResourceAttributeGenerator.COMPOSITION,
    });
    this.sk = this.addAttribute({
      name: DynamoTable.of(this.project).sk.name,
      comments: [`Sort Key for this record.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.HIDDEN,
      generator: ResourceAttributeGenerator.COMPOSITION,
    });

    /***************************************************************************
     * Lookup Access Pattern
     **************************************************************************/

    this.idx = this.addAttribute({
      name: DynamoTable.of(this.project).idx.name,
      comments: [`Lookup value for this record.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.HIDDEN,
      generator: ResourceAttributeGenerator.COMPOSITION,
      compositionsSeperator: " ",
    });

    /***************************************************************************
     * Identifier Attribute
     **************************************************************************/

    this.id = this.addAttribute({
      name: "id",
      comments: [`Identifier for this record.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.USER_VISIBLE,
      identifier: IdentifierType.PRIMARY,
      createGenerator: ResourceAttributeGenerator.GUID,
    });
    this.sk.addCompositionSource(this.id);

    /***************************************************************************
     * Type Attribute
     **************************************************************************/

    this.type = this.addAttribute({
      name: "type",
      shortName: "t",
      comments: [`Type of record.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.USER_VISIBLE,
      createGenerator: ResourceAttributeGenerator.TYPE,
    });
    this.sk.addCompositionSource(this.type);

    /***************************************************************************
     * Version Attribute
     **************************************************************************/

    this.version = this.addAttribute({
      name: "version",
      shortName: "v",
      comments: [`Version for record.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.USER_VISIBLE,
      createGenerator: ResourceAttributeGenerator.VERSION_DATE_TIME_STAMP,
    });
    this.sk.addCompositionSource(this.version);

    /***************************************************************************
     * Audit Dates
     **************************************************************************/

    this.dateCreated = this.addAttribute({
      name: "created-timestamp",
      shortName: "ct",
      comments: [`The timestamp representing when this record was created.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.USER_VISIBLE,
      createGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
      updateGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    this.dateModified = this.addAttribute({
      name: "modified-timestamp",
      shortName: "mt",
      comments: [
        `The timestamp representing when this record was last modified.`,
      ],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.USER_VISIBLE,
      updateGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    this.dateDeleted = this.addAttribute({
      name: "deleted-timestamp",
      shortName: "dt",
      comments: [
        `The timestamp representing when this record was marked as deleted.`,
      ],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.HIDDEN,
      deleteGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });

    /***************************************************************************
     * Attributes based on options
     **************************************************************************/

    if (options.attributeOptions) {
      options.attributeOptions.forEach((attributeOption) => {
        this.addAttribute(attributeOption);
      });
    }
    return this;
  }

  /**
   * Adds an attribute to this resource.
   * Also manages some data structures used in code generation.
   */
  public addAttribute(options: Omit<ResourceAttributeOptions, "resource">) {
    const attribute = new ResourceAttribute(this.project, {
      resource: this,
      ...options,
    });

    /***************************************************************************
     * Update data structures
     **************************************************************************/

    // if user visible, add to public data structure
    if (attribute.visibility === VisabilityType.USER_VISIBLE) {
      this.publicDataStructure.addAttribute({
        name: attribute.name,
        type: attribute.type,
        typeParameter: attribute.typeParameter,
        comments: attribute.comments,
        required: attribute.required,
      });
    }

    // everything goes into private data structure
    this.privateDataStructure.addAttribute({
      name: attribute.shortName,
      type: attribute.type,
      typeParameter: attribute.typeParameter,
      comments: attribute.comments,
      required: attribute.required,
    });

    /***************************************************************************
     * Operation inputs / outputs
     **************************************************************************/

    // if user visible it might be an input or output
    if (attribute.visibility === VisabilityType.USER_VISIBLE) {
      // all outputs get everything visible
      this.createOperation.addOutputAttribute(attribute);
      this.readOperation.addOutputAttribute(attribute);
      this.updateOperation.addOutputAttribute(attribute);
      this.deleteOperation.addOutputAttribute(attribute);

      // read / update / delete need identifiers
      if (attribute.identifier === IdentifierType.PRIMARY) {
        this.createOperation.addInputAttribute(attribute);
        this.readOperation.addInputAttribute(attribute);
        this.updateOperation.addInputAttribute(attribute);
        this.deleteOperation.addInputAttribute(attribute);
      }

      // create / update get all user managed
      if (
        attribute.management === ManagementType.USER_MANAGED &&
        attribute.type !== ResourceAttributeType.ARRAY &&
        attribute.type !== ResourceAttributeType.MAP &&
        attribute.type === typeof ResourceAttributeType
      ) {
        this.createOperation.addInputAttribute(attribute);
        this.updateOperation.addInputAttribute(attribute);
      }
    }

    return attribute;
  }

  public addStructure(options: Omit<StructureOptions, "resource">) {
    const structure = new Structure(this.service, {
      ...options,
    });
    this.structures.push(structure);
    return structure;
  }

  public addOperation(options: Omit<OperationOptions, "resource">) {
    const operation = new Operation(this.project, {
      resource: this,
      ...options,
    });
    this.operations.push(operation);
    return operation;
  }

  public addArrayOf(
    resource: Resource,
    options: Partial<ResourceAttributeOptions> = {}
  ) {
    const attribute = this.addAttribute({
      name: resource.pluralName,
      shortName: `${resource.shortName}s`,
      type: ResourceAttributeType.ARRAY,
      typeParameter: resource.name,
      comments: [`Array of ${resource.name} records.`],
      ...options,
    });
    return attribute;
  }

  public addMapOf(
    resource: Resource,
    options: Partial<ResourceAttributeOptions> = {}
  ) {
    const attribute = this.addAttribute({
      name: resource.pluralName,
      shortName: `${resource.shortName}s`,
      type: ResourceAttributeType.MAP,
      typeParameter: resource.name,
      comments: [`Map of ${resource.name} records.`],
      ...options,
    });
    return attribute;
  }

  public addOneOf(
    resource: Resource,
    options: Partial<ResourceAttributeOptions> = {}
  ) {
    const attribute = this.addAttribute({
      name: resource.name,
      shortName: resource.shortName,
      type: resource,
      ...options,
    });
    return attribute;
  }

  public get service() {
    return this.project;
  }
}
