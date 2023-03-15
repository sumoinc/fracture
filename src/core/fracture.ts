import { Component, LoggerOptions, LogLevel } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { deepMerge } from "projen/lib/util";
import { AuditStrategy } from "./audit-strategy";
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
import { TypescriptService } from "../generators/ts/typescript-service";

/**
 *
 * Top level options for Fracture. These options also apply to services and
 * other sub components as they are created, unless they are overridden.
 *
 */
export interface FractureOptions {
  /**
   * Directory where generated code will be placed.
   * @default project.outdir + "/" + namespace
   */
  outdir?: string;
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
 * The root of the entire application.
 */
export class Fracture extends Component {
  // member components
  public readonly services: Service[] = [];
  public readonly organizations: Organization[] = [];
  // project and namespace
  public readonly project: TypeScriptProject;
  public readonly namespace: string;
  // all other options
  public readonly options: Required<FractureOptions>;

  constructor(
    project: TypeScriptProject,
    namespace: string = "fracture",
    options: FractureOptions = {}
  ) {
    super(project);

    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     * These are the options that will be used through all code generation
     * unless explicitly overridden.
     *
     **************************************************************************/

    const defaultOptions: Required<FractureOptions> = {
      outdir: namespace,
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
          },
          suffixes: {
            [OPERATION_SUB_TYPE.CREATE_ONE]: "",
            [OPERATION_SUB_TYPE.READ_ONE]: "",
            [OPERATION_SUB_TYPE.UPDATE_ONE]: "",
            [OPERATION_SUB_TYPE.DELETE_ONE]: "",
            [OPERATION_SUB_TYPE.IMPORT_ONE]: "",
            [OPERATION_SUB_TYPE.LIST]: "",
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
    ]) as Required<FractureOptions>;

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

    this.project.jest!.addTestMatch(
      "<rootDir>/(test|src)/**/*.(spec|test).ts?(x)"
    );

    // dependancies fracture needs
    this.project.addDeps(
      "@aws-sdk/client-dynamodb",
      "@aws-sdk/lib-dynamodb",
      "@aws-sdk/util-dynamodb",
      "@types/aws-lambda",
      "change-case",
      "projen",
      "type-fest",
      "uuid"
    );
    this.project.addDevDeps("@types/uuid");
    this.project.addPeerDeps("@aws-sdk/smithy-client", "@aws-sdk/types");

    // add Dynalite support for Jest
    new DynaliteSupport(this);

    return this;
  }

  /**
   * Build the project.
   *
   * Call this when you've configured everything, prior to preSynthesize.
   *
   * @returns void
   */
  public build() {
    this.project.logger.info(`BUILD Fracture: "${this.project.name}"`);
    this.services.forEach((service) => {
      service.build();
      new TypescriptService(service);
    });
  }

  public get outdir() {
    return this.options.outdir;
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
