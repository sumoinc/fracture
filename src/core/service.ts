import { join } from "path";
import { paramCase } from "change-case";
import { Component, LoggerOptions } from "projen";
import { NodePackageManager } from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";
import { deepMerge } from "projen/lib/util";
import { AuditStrategy } from "./audit-strategy";
import { Fracture } from "./fracture";
import { NamingStrategy } from "./naming-strategy";
import { Resource, ResourceOptions } from "./resource";
import { DynaliteSupport } from "../dynamodb";
import { DynamoGsi } from "../dynamodb/dynamo-gsi";
import { DynamoTable } from "../dynamodb/dynamo-table";
import { TypescriptTypes } from "../generators/ts/typescript-types";

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
  public readonly dynaliteSupport: DynaliteSupport;
  public readonly project: TypeScriptProject;
  // parent
  public readonly fracture: Fracture;
  // all other options
  public readonly options: Required<ServiceOptions>;
  // generators
  //public readonly ts: TypescriptService;

  // output files / generators
  public readonly tsTypes: TypescriptTypes;

  constructor(fracture: Fracture, options: ServiceOptions) {
    super(fracture);
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
      { ...fracture.options },
      options,
      forcedOptions,
    ]) as Required<ServiceOptions>;

    this.options = mergedOptions;
    this.fracture = fracture;

    /***************************************************************************
     *
     * CREATE PACKAGE SUB-PROJECT
     *
     * This powers a sub-project to house all generated code as a package. This
     * is mostly generated code and should not be touched by devs unless really
     * needed.
     *
     **************************************************************************/

    const project = new TypeScriptProject({
      defaultReleaseBranch: "main",
      name: this.packageName,
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
    this.project = project;

    /***************************************************************************
     *
     * INIT SERVICE
     *
     **************************************************************************/

    this.fracture.logger.info("-".repeat(80));
    this.fracture.logger.info(`INIT Service: "${this.name}"`);
    this.fracture.logger.info("-".repeat(80));

    // inverse
    this.fracture.services.push(this);

    /***************************************************************************
     *
     * DYNAMO TABLE
     *
     * Add dynamo table per options defined in service definition
     *
     **************************************************************************/

    this.dynamoTable = new DynamoTable(this);

    // add Dynalite support for Jest tests
    this.dynaliteSupport = new DynaliteSupport(this);

    /***************************************************************************
     *
     * GENERATORS
     *
     **************************************************************************/

    //this.ts = new TypescriptService(this);

    this.tsTypes = new TypescriptTypes(this);

    return this;
  }

  /*
  public build() {
    this.project.logger.info(`BUILD Service: "${this.name}"`);
    //this.dynaliteSupport.build();
    this.resources.forEach((resource) => {
      resource.build();
    });
    // build generators
    this.ts.build();
  }
  */

  public get name(): string {
    return this.options.name;
  }

  public get packageName(): string {
    return `@${this.fracture.name}/${this.name}-pkg`;
  }

  public get serviceName(): string {
    return `@${this.fracture.name}/${this.name}-svc`;
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
