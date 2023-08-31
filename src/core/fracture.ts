import { LogLevel, LoggerOptions } from "projen";
import { NodePackageManager } from "projen/lib/javascript";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { SetRequired, ValueOf } from "type-fest";
import { Account } from "./account";
import { Environment, EnvironmentOptions } from "./environment";
import { FractureApp, FractureAppOptions } from "./fracture-app";
import { FractureService, FractureServiceOptions } from "./fracture-service";
import { REGION_IDENTITIER } from "./region";
import { VsCodeConfiguration } from "../projen";

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
   * Branch names to build pipelines for
   *
   * @default ["main", "feature", "fix", "chore"]
   */
  branchNames?: Array<string>;
  /**
   * Default Account number for environments.
   * @default 0000000000
   */
  defaultAccountNumber?: string;
  /**
   * Default region  for environments.
   * @default us-east-1
   */
  defaultRegion?: ValueOf<typeof REGION_IDENTITIER>;
}

export type StoredFractureOptions = SetRequired<
  FractureOptions,
  | "name"
  | "serviceRoot"
  | "appRoot"
  | "srcDir"
  | "logging"
  | "branchNames"
  | "defaultReleaseBranch"
  | "defaultAccountNumber"
  | "defaultRegion"
>;

/**
 * The root of the entire application.
 */
export class Fracture extends TypeScriptProject {
  /**
   * The options that fracture was initialized with. Useful for copying them
   * into subprojects
   */
  public readonly options: StoredFractureOptions;
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
   * Default Account number for environments.
   * @default 0000000000
   */
  public readonly defaultAccountNumber: string;
  /**
   * Default region  for environments.
   * @default us-east-1
   */
  public readonly defaultRegion: ValueOf<typeof REGION_IDENTITIER>;
  /**
   * All services in this project.
   */
  public readonly accounts: Array<Account> = [];
  /**
   * All services in this project.
   */
  public readonly services: Array<FractureService> = [];
  /**
   * All apps in this project.
   */
  public readonly apps: Array<FractureApp> = [];

  /**
   * Deployment Environments
   */
  public readonly environments: Array<Environment> = [];

  constructor(options: FractureOptions = {}) {
    /***************************************************************************
     * Projen Props
     **************************************************************************/

    const mergedOptions: StoredFractureOptions = {
      name: options.name ?? "fracture",
      serviceRoot: options.serviceRoot ?? "services",
      appRoot: options.appRoot ?? "apps",
      srcDir: options.srcDir ?? "src",
      logging: options.logging ?? {
        level: LogLevel.OFF,
      },
      defaultReleaseBranch: options.defaultReleaseBranch ?? "main",
      branchNames: options.branchNames ?? ["main", "feature", "fix", "chore"],
      defaultAccountNumber: options.defaultAccountNumber ?? "0000000000",
      defaultRegion: options.defaultRegion ?? "us-east-1",
      ...options,
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

    super({ ...mergedOptions });

    // save in case subprojects need the original values
    this.options = mergedOptions;

    /***************************************************************************
     * Props
     **************************************************************************/

    this.serviceRoot = mergedOptions.serviceRoot;
    this.appRoot = mergedOptions.appRoot;
    this.srcDir = mergedOptions.srcDir;
    this.defaultReleaseBranch = mergedOptions.defaultReleaseBranch;
    this.defaultAccountNumber = mergedOptions.defaultAccountNumber;
    this.defaultRegion = mergedOptions.defaultRegion;

    /***************************************************************************
     * BRANCH STRATEGY & PIPELINES
     **************************************************************************/

    /*
    mergedOptions.branchNames.forEach((branchName) => {
      this.addPipeline({
        branchName,
      });
    });
    */

    /***************************************************************************
     * VS CODE
     **************************************************************************/

    new VsCodeConfiguration(this);

    return this;
  }

  public addAccount(options: FractureAppOptions) {
    return new FractureApp(this, options);
  }

  public addApp(options: FractureAppOptions) {
    const app = new FractureApp(this, options);
    this.apps.push(app);
    return app;
  }

  public addService(options: FractureServiceOptions) {
    const service = new FractureService(this, options);
    this.services.push(service);
    return service;
  }

  public addEnvironment(options: EnvironmentOptions) {
    return new Environment(this, options);
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
