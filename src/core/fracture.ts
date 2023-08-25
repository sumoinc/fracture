import { LogLevel, LoggerOptions } from "projen";
import { NodePackageManager } from "projen/lib/javascript";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { Environment, EnvironmentOptions } from "./environment";
import { FractureApp, FractureAppOptions } from "./fracture-app";
import { FractureService, FractureServiceOptions } from "./fracture-service";
import { Pipeline, PipelineOptions } from "../pipelines";
import { PnpmWorkspace } from "../pnpm";
import { VsCodeConfiguration } from "../projen";
import { TurboRepo, TurboRepoOptions } from "../turborepo/turbo-repo";

export interface FractureOptions extends Partial<TypeScriptProjectOptions> {
  /**
   * Root relative directory which contains all services.
   *
   * @default "services"
   */
  serviceRoot?: string;
  /**
   * Root relative directory which contains all apps.
   *
   * @default "apps"
   */
  appRoot?: string;
  /**
   * Relative source directory inside each package and app
   *
   * @default "src"
   */
  srcDir?: string;
  /**
   * Logging options
   *
   * @default { level: LogLevel.OFF }
   */
  logging?: LoggerOptions;
  /**
   * Versioned.
   *
   * @default true
   */
  //isVersioned?: boolean;
  /**
   * The naming strategy to use for generated code.
   */
  //namingStrategy?: NamingStrategy;
  /**
   * The audit strategy to use for generated code.
   */
  //auditStrategy?: AuditStrategy;
  /**
   * Options for using TurboRepo
   *
   * @default {}
   */
  turboRepoOptions?: TurboRepoOptions;
}

/**
 * The root of the entire application.
 */
export class Fracture extends TypeScriptProject {
  /**
   * Root relative directory which contains all services.
   *
   * @default "services"
   */
  public readonly serviceRoot: string;
  /**
   * Root relative directory which contains all apps.
   *
   * @default "apps"
   */
  public readonly appRoot: string;
  /**
   * Relative source directory inside each package and app
   *
   * @default "src"
   */
  public readonly srcDir: string;
  /**
   * The default release branch for this project.
   */
  public readonly defaultReleaseBranch: string;
  /**
   * All services in this project.
   */
  public readonly services: Array<FractureService> = [];
  /**
   * All apps in this project.
   */
  public readonly apps: Array<FractureApp> = [];
  public readonly productionPipeline: Pipeline;
  public readonly featurePipeline: Pipeline;
  /**
   * Deployment Pipelines
   */
  public readonly pipelines: Array<Pipeline> = [];
  /**
   * Deployment Environments
   */
  public readonly environments: Array<Environment> = [];

  constructor(options: FractureOptions = {}) {
    /***************************************************************************
     * Projen Props
     **************************************************************************/

    const defaultReleaseBranch = options.defaultReleaseBranch ?? "main";

    const projenOptions: TypeScriptProjectOptions = {
      name: options.name ?? "fracture",
      defaultReleaseBranch,
      logging: options.logging ?? {
        level: LogLevel.OFF,
      },
      prettier: true,
      projenrcTs: true,
      licensed: false,
      deps: ["@sumoc/fracture"],

      // tell projen not to in clude the package step during builds for this project
      package: false,

      // pnpm configs
      packageManager: NodePackageManager.PNPM,
      pnpmVersion: "8",

      // node version for GitHub actions
      workflowNodeVersion: "18",
      workflowPackageCache: true,
    };

    super(projenOptions);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.serviceRoot = options.serviceRoot ?? "services";
    this.appRoot = options.appRoot ?? "apps";
    this.srcDir = options.srcDir ?? "src";
    this.defaultReleaseBranch = defaultReleaseBranch;

    /***************************************************************************
     * TUBOREPO
     **************************************************************************/

    new TurboRepo(this, options.turboRepoOptions ?? {});

    /***************************************************************************
     * PIPELNES
     **************************************************************************/

    this.productionPipeline = this.addPipeline({
      name: "deploy-production",
      branchTriggerPatterns: ["main"],
    });

    this.featurePipeline = this.addPipeline({
      name: "deploy-feature",
      branchTriggerPatterns: ["feature/*"],
    });

    /***************************************************************************
     * PNPM - enable workspaces
     **************************************************************************/

    new PnpmWorkspace(this);

    /***************************************************************************
     * VS CODE
     **************************************************************************/

    new VsCodeConfiguration(this);

    return this;
  }

  public addService(options: FractureServiceOptions) {
    const service = new FractureService(this, options);
    this.services.push(service);
    return service;
  }

  public addApp(options: FractureAppOptions) {
    const app = new FractureApp(this, options);
    this.apps.push(app);
    return app;
  }

  public addPipeline(options: PipelineOptions) {
    const pipeline = new Pipeline(this, options);
    this.pipelines.push(pipeline);
    return pipeline;
  }

  public addEnvironment(options: EnvironmentOptions) {
    const environment = new Environment(this, options);
    this.environments.push(environment);
    return environment;
  }

  /***************************************************************************
   *
   * DEFAULT OPTIONS
   *
   * These are the options that will be used through all code generation
   * unless explicitly overridden.
   *
   **************************************************************************/

  /*
    const defaultOptions: Partial<FractureOptions> = {
      name: options.name,
      defaultReleaseBranch: "main",
      packageRoot: "packages",
      appRoot: "apps",
      srcDir: "src",
      logging: {
        level: LogLevel.INFO,
      },
      workflowNodeVersion: "18",
      workflowPackageCache: true,
      isVersioned: true,
      namingStrategy: {
        ts: {
          attributeName: NAMING_STRATEGY_TYPE.CAMEL_CASE,
          className: NAMING_STRATEGY_TYPE.PASCAL_CASE,
          enumName: NAMING_STRATEGY_TYPE.PASCAL_CASE,
          fileName: NAMING_STRATEGY_TYPE.PARAM_CASE,
          functionName: NAMING_STRATEGY_TYPE.CAMEL_CASE,
          functionParameterName: NAMING_STRATEGY_TYPE.CAMEL_CASE,
          interfaceName: NAMING_STRATEGY_TYPE.PASCAL_CASE,
          typeName: NAMING_STRATEGY_TYPE.PASCAL_CASE,
        },
        appsync: {
          vtl: {
            file: NAMING_STRATEGY_TYPE.PARAM_CASE,
          },
        },
        attributes: {
          compositionSeperator: "#",
        },
        structures: {
          prefixes: {
            [STRUCTURE_TYPE.DATA]: "",
            [STRUCTURE_TYPE.INPUT]: "",
            [STRUCTURE_TYPE.OUTPUT]: "",
            [STRUCTURE_TYPE.TRANSIENT]: "",
          },
          suffixes: {
            [STRUCTURE_TYPE.DATA]: "",
            [STRUCTURE_TYPE.INPUT]: "input",
            [STRUCTURE_TYPE.OUTPUT]: "output",
            [STRUCTURE_TYPE.TRANSIENT]: "message",
          },
        },
        operations: {
          prefixes: {
            [OPERATION_SUB_TYPE.CREATE_ONE]: "create",
            [OPERATION_SUB_TYPE.READ_ONE]: "get",
            [OPERATION_SUB_TYPE.UPDATE_ONE]: "update",
            [OPERATION_SUB_TYPE.DELETE_ONE]: "delete",
            [OPERATION_SUB_TYPE.IMPORT_ONE]: "import",
            [OPERATION_SUB_TYPE.LIST]: "list",
            [OPERATION_SUB_TYPE.CREATE_VERSION]: "create",
            [OPERATION_SUB_TYPE.READ_VERSION]: "get",
          },
          suffixes: {
            [OPERATION_SUB_TYPE.CREATE_ONE]: "",
            [OPERATION_SUB_TYPE.READ_ONE]: "",
            [OPERATION_SUB_TYPE.UPDATE_ONE]: "",
            [OPERATION_SUB_TYPE.DELETE_ONE]: "",
            [OPERATION_SUB_TYPE.IMPORT_ONE]: "",
            [OPERATION_SUB_TYPE.LIST]: "",
            [OPERATION_SUB_TYPE.CREATE_VERSION]: "version",
            [OPERATION_SUB_TYPE.READ_VERSION]: "version",
          },
        },
      },
      auditStrategy: {
        create: {
          dateAttribute: {
            name: "created-at",
            shortName: "cd",
            comments: [`The date and time this record was created.`],
            type: ResourceAttributeType.DATE_TIME,
            isRequired: true,
            isSystem: true,
            generator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
            generateOn: [OPERATION_SUB_TYPE.CREATE_ONE],
          },
        },
        update: {
          dateAttribute: {
            name: "updated-at",
            shortName: "ud",
            comments: [`The date and time this record was last updated.`],
            type: ResourceAttributeType.DATE_TIME,
            isRequired: true,
            isSystem: true,
            generator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
            generateOn: [
              OPERATION_SUB_TYPE.CREATE_ONE,
              OPERATION_SUB_TYPE.UPDATE_ONE,
            ],
          },
        },
        delete: {
          dateAttribute: {
            name: "deleted-at",
            shortName: "dd",
            comments: [`The date and time this record was deleted.`],
            type: ResourceAttributeType.DATE_TIME,
            isRequired: true,
            isSystem: true,
            generator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
            generateOn: [],
            outputOn: [OPERATION_SUB_TYPE.DELETE_ONE],
          },
        },
      },
    };

    const requiredOptions: Partial<FractureOptions> = {
      packageManager: NodePackageManager.PNPM,
      pnpmVersion: "8",
      prettier: true,
      projenrcTs: true,
      deps: ["turbo"].concat(options.deps ?? []),
    };

    const mergedOptions = deepMerge([
      defaultOptions,
      options,
      requiredOptions,
    ]) as Required<FractureOptions>;

    super(mergedOptions);
    this.options = mergedOptions;


    */
  /***************************************************************************
   * WORKFLOWS
   **************************************************************************/

  // configure workflows
  //this.workflows = new Workflows(this);

  // this.logger.info("=".repeat(80));
  // this.logger.info("INIT PHASE");
  // this.logger.info("=".repeat(80));

  //   return this;
  // }

  /*
  public get packageRoot(): string {
    return this.options.packageRoot;
  }

  public get appRoot(): string {
    return this.options.appRoot;
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
  */

  /*
  public get buildTask() {
    return TurboRepo.buildTask(this);
  }
  */

  /*****************************************************************************
   *
   *  Configuration Helpers
   *
   ****************************************************************************/

  /**
   * Add a service to the fracture project.
   * @param {FractureAppOptions}
   * @returns {FractureApp}
   */
  // public addApp(options: FractureAppOptions) {
  //   return new FractureApp(this, options);
  // }

  /**
   * Add an organization to the fracture project.
   * @param {OrganizationOptions}
   * @returns {Organization}
   */
  /*public addOrganization(options: OrganizationOptions) {
    return new Organization(this, options);
  }*/

  /**
   * Add a service to the fracture project.
   * @param {ServiceOptions}
   * @returns {Service}
   */
  // public addService(options: FractureServiceOptions) {
  //   return new FractureService(this, options);
  // }

  /**
   * Add a environment to the fracture project.
   * @param {EnvironmentOptions}
   * @returns {Environment}
   */
  /*public addEnvironment(options: EnvironmentOptions) {
    return new Environment(this, options);
  }*/
}
