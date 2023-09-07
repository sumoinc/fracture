import { Project } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { Resource, ResourceOptions } from "./resource";
import { Service, ServiceOptions } from "./service";
import { Structure, StructureOptions } from "./structure";
import { StructureAttributeType } from "./structure-attribute";
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
  readonly resourceOptions?: Array<ResourceOptions>;
  /**
   * Typescript strategy options
   *
   * @default fracture defaults
   */
  //typescriptStrategyOptions?: TypescriptStrategyOptions;

  // srcDir?: string;
  /**
   * Logging options
   * @default LogLevel.INFO
   */
  //logging?: LoggerOptions;
  /**
   * Versioned.
   * @default false
   */
  //isVersioned?: boolean;
  /**
   * The naming strategy to use for generated code.
   */
  // namingStrategy?: NamingStrategy;
  /**
   * The audit strategy to use for generated code.
   */
  //auditStrategy?: AuditStrategy;
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
   * Defines typescript naming conventions for this service.
   */
  public readonly typescriptStrategy: TypescriptStrategy;
  /**
   * All resourcers in this service.
   */
  //public resources: Array<Resource> = [];
  /**
   * Table defnition for the table that supports this service.
   */
  // public readonly dynamoTable: DynamoTable;
  /**
   * All structures for this service.
   */
  // public structures: Array<Structure> = [];
  public readonly errorStructure: Structure;
  public readonly responseStructure: Structure;
  public readonly listResponseStructure: Structure;
  /**
   * Output directory for CDK artifacts (cdk.out)
   */
  //public readonly cdkOutBuildDir: string;
  /**
   * Where deployable artifacts are stored in pipeline runs
   */
  // public readonly cdkOutDistDir: string;

  constructor(options: DataServiceOptions) {
    super(options);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = options.name;
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
      attributeOptions: [
        {
          name: `code`,
          type: StructureAttributeType.INT,
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

    this.responseStructure = this.addStructure({
      name: `response`,
      typeParameter: `T`,
      attributeOptions: [
        {
          name: `data`,
          type: StructureAttributeType.CUSTOM,
          typeParameter: `T`,
          required: false,
        },
        {
          name: `errors`,
          type: StructureAttributeType.ARRAY,
          typeParameter: `error`,
        },
        {
          name: `status`,
          type: StructureAttributeType.INT,
        },
      ],
    });

    this.listResponseStructure = this.addStructure({
      name: `list-response`,
      typeParameter: `T`,
      attributeOptions: [
        {
          name: `data`,
          type: StructureAttributeType.ARRAY,
          typeParameter: `T`,
          required: false,
        },
        {
          name: `errors`,
          type: StructureAttributeType.ARRAY,
          typeParameter: `error`,
        },
        {
          name: `status`,
          type: StructureAttributeType.INT,
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
}
