import { join } from "path";
import { paramCase } from "change-case";
import {
  AwsCdkTypeScriptApp,
  AwsCdkTypeScriptAppOptions,
} from "projen/lib/awscdk";
import { NodePackageManager } from "projen/lib/javascript";

import { Fracture } from "./fracture";
import { Resource, ResourceOptions } from "./resource";
import { Structure, StructureOptions } from "./structure";
import { StructureAttributeType } from "./structure-attribute";
import { DynamoTable } from "../dynamodb";
import { GeneratedTypes } from "../generators";
import { GeneratedCdkApp } from "../generators/ts/cdk-app";
import {
  TypescriptStrategy,
  TypescriptStrategyOptions,
} from "../generators/ts/strategy";

export interface FractureServiceOptions
  extends Partial<AwsCdkTypeScriptAppOptions> {
  /**
   * A name for the service
   */
  name: string;
  /**
   * Typescript strategy options
   *
   * @default fracture defaults
   */
  typescriptStrategyOptions?: TypescriptStrategyOptions;
  /**
   * Options for resources to add when initializing the service.
   */
  resourceOptions?: Array<ResourceOptions>;
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

export class FractureService extends AwsCdkTypeScriptApp {
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
  public resources: Array<Resource> = [];
  /**
   * Table defnition for the table that supports this service.
   */
  public readonly dynamoTable: DynamoTable;
  /**
   * All structures for this service.
   */
  public structures: Array<Structure> = [];
  public readonly errorStructure: Structure;
  public readonly responseStructure: Structure;
  public readonly listResponseStructure: Structure;
  /**
   * Output directory for CDK artifacts (cdk.out)
   */
  public readonly cdkOutBuildDir: string;
  /**
   * Where deployable artifacts are stored in pipeline runs
   */
  public readonly cdkOutDistDir: string;

  constructor(fracture: Fracture, options: FractureServiceOptions) {
    /***************************************************************************
     * Projen Props
     **************************************************************************/

    // ensure name is param-cased for outdir
    const outdir = join(fracture.serviceRoot, paramCase(options.name));

    const projenOptions: AwsCdkTypeScriptAppOptions = {
      name: options.name,
      cdkVersion: "2.93.0",
      defaultReleaseBranch: "main",
      parent: fracture,
      outdir,
      eslintOptions: {
        dirs: ["src"],
        tsconfigPath: "./**/tsconfig.dev.json",
      },
      licensed: false,
      projenrcTs: true,

      // pnpm configs
      packageManager: NodePackageManager.PNPM,
      pnpmVersion: "8",
    };

    super(projenOptions);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = options.name;
    this.typescriptStrategy = new TypescriptStrategy(this);
    this.cdkOutBuildDir = join(outdir, "cdk.out");
    this.cdkOutDistDir = join(fracture.artifactsDirectory, outdir, "cdk.out");

    /***************************************************************************
     * Dynamo Configuration
     **************************************************************************/

    this.dynamoTable = new DynamoTable(this, { name: this.name });

    /***************************************************************************
     * Initialize standard structures
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

    /***************************************************************************
     * Typescript Generators
     **************************************************************************/

    new GeneratedTypes(this);
    new GeneratedCdkApp(this);
  }

  public addResource(options: ResourceOptions) {
    const resource = new Resource(this, options);
    this.resources.push(resource);
    return resource;
  }

  public addStructure(options: StructureOptions) {
    const structure = new Structure(this, options);
    this.structures.push(structure);
    return structure;
  }
}
