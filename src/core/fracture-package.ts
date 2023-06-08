import { join } from "path";
import { Component, LoggerOptions, LogLevel, typescript } from "projen";
import { NodePackageManager } from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";
import { deepMerge } from "projen/lib/util";
import { AuditStrategy } from "./audit-strategy";
import { FractureProject } from "./fracture-project";
import { NamingStrategy, NAMING_STRATEGY_TYPE } from "./naming-strategy";
import { OPERATION_SUB_TYPE } from "./operation";
import { Organization, OrganizationOptions } from "./organization";
import {
  ResourceAttributeGenerator,
  ResourceAttributeType,
} from "./resource-attribute";
import { Service, ServiceOptions } from "./service";
import { STRUCTURE_TYPE } from "./structure";
import { DynaliteSupport } from "../dynamodb/dynalite-support";

/**
 *
 * Top level options for Fracture. These options also apply to services and
 * other sub components as they are created, unless they are overridden.
 *
 */
export interface FracturePackageOptions {
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
}

/**
 * The root of a package
 */
export class FracturePackage extends Component {
  // member components
  public readonly services: Service[] = [];
  public readonly organizations: Organization[] = [];
  // project and namespace
  public readonly project: TypeScriptProject;
  public readonly fractureProject: FractureProject;
  public readonly namespace: string;
  public readonly outdir: string;
  // all other options
  public readonly options: Required<FracturePackageOptions>;

  constructor(
    fractureProject: FractureProject,
    namespace: string = "fracture",
    options: FracturePackageOptions = {}
  ) {
    /***************************************************************************
     *
     * CREATE SUB-PROJECT
     *
     * This powers a sub-project to house all generated code.
     *
     **************************************************************************/

    // Build sub project
    const project = new typescript.TypeScriptProject({
      defaultReleaseBranch: "main",
      name: namespace,
      parent: fractureProject,
      licensed: false,
      outdir: join(fractureProject.packageDir, namespace),
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

    this.project = project;
    fractureProject.fracturePackages.push(this);
    this.fractureProject = fractureProject;

    // all generated code ends up in src folder
    this.outdir = join("src");

    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     * These are the options that will be used through all code generation
     * unless explicitly overridden.
     *
     **************************************************************************/

    const defaultOptions: Required<FracturePackageOptions> = {
      logging: {
        level: LogLevel.INFO,
      },
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

    /***************************************************************************
     *
     * INIT FRACTURE
     *
     **************************************************************************/

    // member components

    // project and namespace
    this.project = project;
    this.namespace = namespace;

    // all other options
    this.options = deepMerge([
      defaultOptions,
      options,
    ]) as Required<FracturePackageOptions>;

    this.project.logger.info("=".repeat(80));
    this.project.logger.info(`INIT Fracture: "${this.project.name}"`);
    this.project.logger.info(`               outdir: "${this.outdir}`);

    /***************************************************************************
     *
     * CONFIGURE PROJEN
     *
     * We''l be making some adjustments to projen's default configuration so it
     * plays nice with fracture.
     *
     **************************************************************************/
    // add Dynalite support for Jest tests
    new DynaliteSupport(this);

    return this;
  }

  /**
   * Build the package.
   *
   * Call this when you've configured everything, prior to preSynthesize.
   *
   * @returns void
   */
  public build() {
    this.project.logger.info(`BUILD Fracture: "${this.project.name}"`);
    this.services.forEach((service) => {
      service.build();
    });
  }

  public get isVersioned() {
    return this.options.isVersioned;
  }

  public get namingStrategy() {
    return this.options.namingStrategy;
  }

  public get auditStrategy() {
    return this.options.auditStrategy;
  }

  /**
   * Returns index for this package in the overall project.
   * Useful when trying to split up ports for testing in parallel, etc.
   */
  public get packageIndex() {
    const { fracturePackages } = this.fractureProject;
    return (
      fracturePackages.findIndex((p) => p.namespace === this.namespace) || 0
    );
  }

  /*****************************************************************************
   *
   *  Configuration Helpers
   *
   ****************************************************************************/

  /**
   * Add a service to the fracture project.
   * @param {ServiceOptions}
   * @returns {Service}
   */
  public addService(options: ServiceOptions) {
    return new Service(this, options);
  }

  /**
   * Add an organization to the fracture project.
   * @param {OrganizationOptions}
   * @returns {Organization}
   */
  public addOrganization(options: OrganizationOptions) {
    return new Organization(this, options);
  }
}