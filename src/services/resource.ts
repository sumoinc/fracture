import { paramCase } from "change-case";
import { Component } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { DataService } from "./data-service";
import { Operation, OperationOptions } from "./operation";
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
  readonly name: string;

  /**
   * Short name for the Resource.
   */
  readonly shortName?: string;

  /**
   * Plural name for the Resource.
   */
  readonly pluralName?: string;

  /**
   * Comment lines to add to the Resource.
   * @default []
   */
  readonly comments?: string[];

  /**
   * Add tenant identifier to this resource.
   *
   * @default - uses service setting
   */
  readonly tenantEnabled?: boolean;

  /**
   * Options for attributes to add when initializing the resource.
   */
  readonly attributeOptions?: Array<Omit<ResourceAttributeOptions, "resource">>;
}

export class Resource extends Component {
  /**
   * Returns all resourcesa for service
   */
  public static all(project: TypeScriptProject): Array<Resource> {
    const isDefined = (c: Component): c is Resource => c instanceof Resource;
    return project.components.filter(isDefined);
  }

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
  public readonly comments: string[];

  /**
   * Add tenant identifier to this resource.
   *
   * @default - uses service setting
   */
  readonly tenantEnabled: boolean;

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
  public dataStructure: Structure;

  /**
   * All structures for this resource.
   */
  public structures: Structure[] = [];

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
    this.tenantEnabled = options.tenantEnabled ?? project.tenantEnabled;

    /***************************************************************************
     * Initialize data structures
     **************************************************************************/

    this.dataStructure = this.addStructure({
      name: `${this.name}`,
      comments: [`Public facing data structure for this record.`],
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
      name: "lookup",
      shortName: DynamoTable.of(this.project).idx.name,
      comments: [`Lookup value for this record.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.HIDDEN,
      generator: ResourceAttributeGenerator.COMPOSITION,
      compositionsSeperator: " ",
    });

    // if tenant tracking is on, add it to pk and sk
    if (this.tenantEnabled) {
      const tenant = this.addAttribute({
        name: "tenant-id",
        shortName: "tid",
        comments: [`Tenant identifier for this record.`],
        management: ManagementType.SYSTEM_MANAGED,
        visibility: VisabilityType.HIDDEN,
        generator: ResourceAttributeGenerator.TENANT,
      });
      this.pk.addCompositionSource(tenant);
      this.sk.addCompositionSource(tenant);
    }

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
    this.pk.addCompositionSource(this.id);

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
    return new ResourceAttribute(this.project, {
      resource: this,
      ...options,
    });
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

  /***************************************************************************
   * Configuration export for this resource
   **************************************************************************/

  public config(): Record<string, any> {
    return {
      name: this.name,
      shortName: this.shortName,
      pluralName: this.pluralName,
      comments: this.comments,
      tenantEnabled: this.tenantEnabled,
      dynamoTable: DynamoTable.of(this.project).config(),
      attributes: this.attributes.map((a) => a.config()),
      dataStructure: this.dataStructure.config(),
    };
  }
}
