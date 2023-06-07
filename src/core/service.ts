import { join } from "path";
import { paramCase } from "change-case";
import { Component, LoggerOptions } from "projen";
import { NodePackageManager } from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";
import { deepMerge } from "projen/lib/util";
import { DynaliteSupport } from "../dynamodb";
import { DynamoGsi } from "../dynamodb/dynamo-gsi";
import { DynamoTable } from "../dynamodb/dynamo-table";
import { TypescriptService } from "../generators/ts/typescript-service";
import { AuditStrategy } from "./audit-strategy";
import { Fracture } from "./fracture";
import { NamingStrategy } from "./naming-strategy";
import { Resource, ResourceOptions } from "./resource";

export interface ServiceOptions {
  name: string;
  srcDir?: string;
  /**
   * Logging options
   * @default LogLevel.INFO
   */
  logging?: LoggerOptions;
  /**
   * Versioned.
   * @default fracture default
   */
  isVersioned?: boolean;
  /**
   * The naming strategy to use for generated code.
   */
  namingStrategy?: NamingStrategy;
  /**
   * The audit strategy to use for generated code.
   */
  auditStrategy?: AuditStrategy;
}

export class Service extends Component {
  // member components
  public readonly resources: Resource[] = [];
  public readonly dynamoTable: DynamoTable;
  // parent
  public readonly fracture: Fracture;
  // all other options
  public readonly options: Required<ServiceOptions>;
  // generators
  public readonly ts: TypescriptService;

  constructor(fracture: Fracture, options: ServiceOptions) {
    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     * These are the options that will be used through all code generation
     * unless explicitly overridden.
     *
     **************************************************************************/

    // ensure name is param-cased
    const forcedOptions: Partial<ServiceOptions> = {
      name: paramCase(options.name),
    };

    // all other options
    const mergedOptions = deepMerge([
      fracture.options,
      options,
      forcedOptions,
    ]) as Required<ServiceOptions>;

    /***************************************************************************
     *
     * CREATE SUB-PROJECT
     *
     * This powers a sub-project to house all generated code.
     *
     **************************************************************************/

    // Build sub project
    const project = new TypeScriptProject({
      defaultReleaseBranch: "main",
      name: options.name,
      parent: fracture,
      licensed: false,
      outdir: join(fracture.packageRoot, mergedOptions.name),
      packageManager: NodePackageManager.PNPM,
      pnpmVersion: "8",
      prettier: true,
      projenrcTs: true,
      deps: ["@aws-sdk/client-dynamodb", "@aws-sdk/lib-dynamodb", "uuid"],
      devDeps: ["@types/uuid"],
      eslintOptions: {
        dirs: ["src"],
        tsconfigPath: "./**/tsconfig.dev.json",
      },
    });
    super(project);

    this.fracture = fracture;
    this.options = mergedOptions;

    console.log("project", project.outdir);

    /***************************************************************************
     *
     * INIT SERVICE
     *
     **************************************************************************/

    // inverse
    this.fracture.services.push(this);
    this.project.logger.info(`INIT Service: "${this.name}"`);

    /***************************************************************************
     *
     * DYNAMO TABLE
     *
     * Add dynamo table per options defined in service definition
     *
     **************************************************************************/

    this.dynamoTable = new DynamoTable(this);

    // add Dynalite support for Jest tests
    new DynaliteSupport(this);

    /***************************************************************************
     *
     * GENERATORS
     *
     **************************************************************************/

    this.ts = new TypescriptService(this);

    return this;
  }

  public build() {
    this.project.logger.info(`BUILD Service: "${this.name}"`);
    this.resources.forEach((resource) => {
      resource.build();
    });
    // build generators
    this.ts.build();
  }

  public get name(): string {
    return this.options.name;
  }

  public get isVersioned(): boolean {
    return this.options.isVersioned;
  }

  public get namingStrategy(): NamingStrategy {
    return this.options.namingStrategy;
  }

  public get auditStrategy() {
    return this.options.auditStrategy;
  }

  public get srcDir() {
    return this.options.srcDir;
  }

  /**
   * Returns index for this package in the overall project.
   * Useful when trying to split up ports for testing in parallel, etc.
   */
  public get serviceIndex() {
    const { services } = this.fracture;
    return services.findIndex((p) => p.name === this.name) || 0;
  }

  /*****************************************************************************
   *
   *  Configuration Helpers
   *
   ****************************************************************************/

  /**
   * Add a resource to the fracture project.
   *
   * @param {ResourceOptions}
   * @returns {Resource}
   */
  public addResource(options: ResourceOptions) {
    return new Resource(this, options);
  }

  public get keyDynamoGsi(): DynamoGsi {
    return this.dynamoTable.keyDynamoGsi;
  }

  public get lookupDynamoGsi(): DynamoGsi {
    return this.dynamoTable.lookupDynamoGsi;
  }
}
