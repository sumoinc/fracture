import { Component, Project } from "projen";
import { deepMerge } from "projen/lib/util";
import { AuditStrategy } from "./audit-strategy";
import { LookupKeyStrategy } from "./lookup-key-strategy";
import { NamingStrategy, NAMING_STRATEGY_TYPE } from "./naming-strategy";
import { OPERATION_SUB_TYPE } from "./operation";
import { Organization, OrganizationOptions } from "./organization";
import { PartitionKeyStrategy } from "./partition-key-strategy";
import {
  ResourceAttributeGenerator,
  ResourceAttributeType,
} from "./resource-attribute";
import { Service, ServiceOptions } from "./service";
import { STRUCTURE_TYPE } from "./structure";
import { TypeStrategy } from "./type-strategy";
import { VersionStrategy, VERSION_TYPE } from "./version-strategy";

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
   * Versioned.
   * @default true
   */
  isVersioned?: boolean;
  /**
   * The naming strategy to use for generated code.
   * @default defaultNamingStrategyConfig
   */
  namingStrategy?: NamingStrategy;
  /**
   * The type strategy to use for the partition key.
   */
  partitionKeyStrategy?: PartitionKeyStrategy;
  /**
   * The type to use when looking up a resource by a string.
   */
  lookupKeyStrategy?: LookupKeyStrategy;
  /**
   * The versioning strategy to use for generated code.
   */
  versionStrategy?: VersionStrategy;
  /**
   * The type strategy to use for generated code.
   */
  typeStrategy?: TypeStrategy;
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
  public readonly services: Service[];
  public readonly organizations: Organization[];
  // project and namespace
  public readonly project: Project;
  public readonly namespace: string;
  // all other options
  public readonly options: Required<FractureOptions>;

  constructor(
    project: Project,
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
            [OPERATION_SUB_TYPE.CREATE_MANY]: "create",
            [OPERATION_SUB_TYPE.READ_ONE]: "get",
            [OPERATION_SUB_TYPE.READ_MANY]: "get",
            [OPERATION_SUB_TYPE.UPDATE_ONE]: "update",
            [OPERATION_SUB_TYPE.UPDATE_MANY]: "update",
            [OPERATION_SUB_TYPE.DELETE_ONE]: "delete",
            [OPERATION_SUB_TYPE.DELETE_MANY]: "delete",
            [OPERATION_SUB_TYPE.IMPORT_ONE]: "import",
            [OPERATION_SUB_TYPE.IMPORT_MANY]: "import",
          },
          suffixes: {
            [OPERATION_SUB_TYPE.CREATE_ONE]: "",
            [OPERATION_SUB_TYPE.CREATE_MANY]: "",
            [OPERATION_SUB_TYPE.READ_ONE]: "",
            [OPERATION_SUB_TYPE.READ_MANY]: "",
            [OPERATION_SUB_TYPE.UPDATE_ONE]: "",
            [OPERATION_SUB_TYPE.UPDATE_MANY]: "",
            [OPERATION_SUB_TYPE.DELETE_ONE]: "",
            [OPERATION_SUB_TYPE.DELETE_MANY]: "",
            [OPERATION_SUB_TYPE.IMPORT_ONE]: "",
            [OPERATION_SUB_TYPE.IMPORT_MANY]: "",
          },
        },
      },
      partitionKeyStrategy: {
        name: "id",
        comments: [`The unique identifier for this record.`],
        type: ResourceAttributeType.GUID,
        createGenerator: ResourceAttributeGenerator.GUID,
        isRequired: true,
      },
      lookupKeyStrategy: {
        name: "idx",
        comments: [`A value that can be searched on.`],
        type: ResourceAttributeType.STRING,
        createGenerator: ResourceAttributeGenerator.COMPOSITION,
        readGenerator: ResourceAttributeGenerator.COMPOSITION,
        updateGenerator: ResourceAttributeGenerator.COMPOSITION,
        deleteGenerator: ResourceAttributeGenerator.COMPOSITION,
        importGenerator: ResourceAttributeGenerator.COMPOSITION,
        isRequired: true,
        compositionSeperator: "", // no seperator
      },
      versionStrategy: {
        attribute: {
          name: "version",
          shortName: "v",
          comments: [`The version of this record`, `@default "LATEST"`],
          type: ResourceAttributeType.STRING,
          isRequired: true,
          createGenerator: ResourceAttributeGenerator.VERSION,
          readGenerator: ResourceAttributeGenerator.VERSION,
          updateGenerator: ResourceAttributeGenerator.VERSION,
          deleteGenerator: ResourceAttributeGenerator.VERSION,
          importGenerator: ResourceAttributeGenerator.VERSION,
        },
        type: VERSION_TYPE.DATE_TIME_STAMP,
        currentVersion: "LATEST",
        deletedVersion: "DELETED",
      },
      typeStrategy: {
        name: "type",
        shortName: "t",
        comments: ["The type for this record."],
        type: ResourceAttributeType.STRING,
        createGenerator: ResourceAttributeGenerator.TYPE,
        readGenerator: ResourceAttributeGenerator.TYPE,
        updateGenerator: ResourceAttributeGenerator.TYPE,
        deleteGenerator: ResourceAttributeGenerator.TYPE,
        importGenerator: ResourceAttributeGenerator.TYPE,
        isRequired: true,
      },
      auditStrategy: {
        create: {
          dateAttribute: {
            name: "created-at",
            shortName: "cd",
            comments: [`The date and time this record was created.`],
            type: ResourceAttributeType.DATE_TIME,
            isRequired: true,
            createGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
            importGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
          },
        },
        update: {
          dateAttribute: {
            name: "updated-at",
            shortName: "ud",
            comments: [`The date and time this record was last updated.`],
            type: ResourceAttributeType.DATE_TIME,
            isRequired: true,
            createGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
            updateGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
            deleteGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
            importGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
          },
        },
        delete: {
          dateAttribute: {
            name: "deleted-at",
            shortName: "dd",
            comments: [`The date and time this record was deleted.`],
            type: ResourceAttributeType.DATE_TIME,
            deleteGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
          },
        },
      },
    };

    /***************************************************************************
     *
     * INIT FRACTURE PROJECT
     *
     **************************************************************************/

    // member components
    this.services = [];
    this.organizations = [];

    // project and namespace
    this.project = project;
    this.namespace = namespace;

    // all other options
    this.options = deepMerge([
      defaultOptions,
      options,
    ]) as Required<FractureOptions>;

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
    this.services.forEach((service) => {
      service.build();
      //new TypescriptService(service);
    });
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
