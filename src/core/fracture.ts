import { LogLevel, LoggerOptions } from "projen";
import { NodePackageManager } from "projen/lib/javascript";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { deepMerge } from "projen/lib/util";
import { SetOptional } from "type-fest";
import { AuditStrategy } from "./audit-strategy";
import { Environment, EnvironmentOptions } from "./environment";
import { FractureApp, FractureAppOptions } from "./fracture-app";
import { NamingStrategy, NAMING_STRATEGY_TYPE } from "./naming-strategy";
import { OPERATION_SUB_TYPE } from "./operation";
import { Organization, OrganizationOptions } from "./organization";
import {
  ResourceAttributeGenerator,
  ResourceAttributeType,
} from "./resource-attribute";
import { Service, ServiceOptions } from "./service";
import { STRUCTURE_TYPE } from "./structure";
import { Workflows } from "../github/workflows";
import { PnpmWorkspace } from "../pnpm/pnpm-workspace";
import { VsCodeConfiguration } from "../projen";
import { TurboRepo, TurboRepoOptions } from "../turborepo/turbo-repo";

/**
 *
 * Top level options for Fracture. These options also apply to services and
 * other sub components as they are created, unless they are overridden.
 *
 */
export interface FractureOptions extends TypeScriptProjectOptions {
  packageRoot?: string;
  appRoot?: string;
  /**
   * Source directory inside each package
   * @default "src"
   */
  srcDir?: string;
  /**
   * Logging options
   * @default LogLevel.INFO
   */
  logging?: LoggerOptions;
  /**
   * Versioned.
   * @default true
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
  /**
   * Enable Turborepo
   *
   * @default true
   */
  turboRepoEnabled?: boolean;
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
  // member components
  public readonly apps: FractureApp[] = [];
  public readonly services: Service[] = [];
  public readonly organizations: Organization[] = [];
  public readonly environments: Environment[] = [];
  // public readonly turborepo: TurboRepo;
  public readonly workflows: Workflows;

  // all other options
  public readonly options: Required<FractureOptions>;

  constructor(options: SetOptional<FractureOptions, "defaultReleaseBranch">) {
    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     * These are the options that will be used through all code generation
     * unless explicitly overridden.
     *
     **************************************************************************/

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

    // configure workspace
    new PnpmWorkspace(this);

    // configure vscode
    new VsCodeConfiguration(this);

    /***************************************************************************
     * TUBOREPO
     **************************************************************************/

    const turboRepoEnabled = options.turboRepoEnabled ?? true;
    const turboRepoOptions = options.turboRepoOptions ?? {};

    if (turboRepoEnabled) {
      new TurboRepo(this, turboRepoOptions);
    }

    /***************************************************************************
     * WORKFLOWS
     **************************************************************************/

    // configure workflows
    this.workflows = new Workflows(this);

    this.logger.info("=".repeat(80));
    this.logger.info("INIT PHASE");
    this.logger.info("=".repeat(80));
  }

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
  public addApp(options: FractureAppOptions) {
    return new FractureApp(this, options);
  }

  /**
   * Add an organization to the fracture project.
   * @param {OrganizationOptions}
   * @returns {Organization}
   */
  public addOrganization(options: OrganizationOptions) {
    return new Organization(this, options);
  }

  /**
   * Add a service to the fracture project.
   * @param {ServiceOptions}
   * @returns {Service}
   */
  public addService(options: ServiceOptions) {
    return new Service(this, options);
  }

  /**
   * Add a environment to the fracture project.
   * @param {EnvironmentOptions}
   * @returns {Environment}
   */
  public addEnvironment(options: EnvironmentOptions) {
    return new Environment(this, options);
  }
}
