import { Project } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { Operation } from "./operation";
import { Resource, ResourceOptions } from "./resource";
import { ResourceAttributeType } from "./resource-attribute";
import { Service, ServiceOptions } from "./service";
import { Structure, StructureOptions } from "./structure";
import { DynamoTable, DynamoTableOptions } from "../dynamodb";
import { TypescriptStrategy } from "../generators/ts/strategy";

export interface DataServiceOptions extends ServiceOptions {
  /**
   * Options for the dynamo table.
   *
   * @default - fracture defaults
   */
  readonly dynamoTableOptions?: DynamoTableOptions;

  /**
   * Options for resources to add when initializing the service.
   */
  readonly resourceOptions?: Array<Omit<ResourceOptions, "service">>;

  /**
   * Add tenant identifier to all resources.
   *
   * @default - false
   */
  readonly tenantEnabled?: boolean;
}

export class DataService extends Service {
  /**
   * Returns a service by name, or undefined if it doesn't exist
   */
  public static byName(
    project: TypeScriptProject,
    name: string
  ): DataService | undefined {
    const isDefined = (c: Project): c is DataService =>
      c instanceof DataService && c.name === name;
    return project.subprojects.find(isDefined);
  }

  /**
   * Returns all services
   */
  public static all(project: TypeScriptProject): DataService[] {
    const isDefined = (c: Project): c is DataService =>
      c instanceof DataService;
    return project.subprojects.filter(isDefined);
  }

  /**
   * A name for the service.
   */
  public readonly name: string;

  /**
   * Add tenant identifier to all resources.
   *
   * @default - false
   */
  public readonly tenantEnabled: boolean;

  /**
   * Defines typescript naming conventions for this service.
   */
  public readonly typescriptStrategy: TypescriptStrategy;

  /**
   * All structures for this service.
   */
  public readonly structures: Structure[] = [];

  /**
   * The standard generic error structure for this resource type.
   */
  public readonly errorStructure: Structure;

  /**
   * The standard generic request structure for this resource type.
   */
  public readonly requestStructure: Structure;

  /**
   * The standard generic response structure for this resource type.
   */
  public readonly responseStructure: Structure;

  /**
   * The standard generic list request structure for this resource type.
   */
  public readonly listRequestStructure: Structure;

  /**
   * The standard generic list response structure for this resource type.
   */
  public readonly listResponseStructure: Structure;

  constructor(options: DataServiceOptions) {
    super(options);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = options.name;
    this.tenantEnabled = options.tenantEnabled ?? false;
    this.typescriptStrategy = new TypescriptStrategy(this);

    /***************************************************************************
     * Dynamo Configuration
     **************************************************************************/

    if (options.dynamoTableOptions) {
      new DynamoTable(this, options.dynamoTableOptions);
    }

    /***************************************************************************
     * Initialize standard default structure shapes
     **************************************************************************/

    this.errorStructure = this.addStructure({
      name: `error`,
      persistant: false,
      attributeOptions: [
        {
          name: `code`,
          type: ResourceAttributeType.INT,
        },
        {
          name: `source`,
        },
        {
          name: `message`,
        },
        {
          name: `detail`,
        },
      ],
    });

    this.requestStructure = this.addStructure({
      name: `request`,
      typeParameter: `T`,
      persistant: false,
      attributeOptions: [
        {
          name: `input`,
          type: "T",
          required: false,
        },
      ],
    });

    this.responseStructure = this.addStructure({
      name: `response`,
      typeParameter: `T`,
      persistant: false,
      attributeOptions: [
        {
          name: `data`,
          type: "T",
          required: false,
        },
        {
          name: `errors`,
          type: ResourceAttributeType.ARRAY,
          typeParameter: `error`,
        },
        {
          name: `status`,
          type: ResourceAttributeType.INT,
        },
      ],
    });

    this.listRequestStructure = this.addStructure({
      name: `list-request`,
      typeParameter: `T`,
      persistant: false,
      attributeOptions: [
        {
          name: `indexTerm`,
          comments: [
            `A search string to filter the list by. `,
            `Will match starting string in index text. Case insensitive.`,
          ],
          type: ResourceAttributeType.STRING,
        },
        {
          name: `nextToken`,
          type: ResourceAttributeType.STRING,
        },
      ],
    });

    this.listResponseStructure = this.addStructure({
      name: `list-response`,
      typeParameter: `T`,
      persistant: false,
      attributeOptions: [
        {
          name: `data`,
          type: ResourceAttributeType.ARRAY,
          typeParameter: `T`,
          required: false,
        },
        {
          name: `errors`,
          type: ResourceAttributeType.ARRAY,
          typeParameter: `error`,
        },
        {
          name: `status`,
          type: ResourceAttributeType.INT,
        },
      ],
    });

    /***************************************************************************
     * Resources based on options
     **************************************************************************/

    if (options.resourceOptions) {
      options.resourceOptions.forEach((resourceOption) => {
        this.addResource(resourceOption);
      });
    }
  }

  public addResource(options: ResourceOptions) {
    return new Resource(this, options);
  }

  public addStructure(options: StructureOptions) {
    return new Structure(this, options);
  }

  /***************************************************************************
   * Configuration export for this service
   **************************************************************************/

  public config(): Record<string, any> {
    return {
      ...super.config(),
      name: this.name,
      tenantEnabled: this.tenantEnabled,
      dynamo: DynamoTable.of(this).config(),
      resources: Resource.all(this).map((r) => r.config()),
      operations: Operation.all(this).map((o) => o.config()),
    };
  }
}
