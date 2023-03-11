import { join } from "path";
import { paramCase } from "change-case";
import { deepMerge } from "projen/lib/util";
import { Fracture, FractureComponent } from ".";
import { AuditStrategy } from "./audit-strategy";
import { NamingStrategy } from "./naming-strategy";
import { Resource, ResourceOptions } from "./resource";
import { TypeStrategy } from "./type-strategy";
import { VersionStrategy } from "./version-strategy";
import { DynamoGsi } from "../dynamodb/dynamo-gsi";
import { DynamoTable } from "../dynamodb/dynamo-table";

export interface ServiceOptions {
  name: string;
  outdir?: string;
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
  dynamoTable?: DynamoTable;
}

export class Service extends FractureComponent {
  // member components
  public readonly resources: Resource[];
  // all other options
  public readonly options: Required<ServiceOptions>;

  constructor(fracture: Fracture, options: ServiceOptions) {
    super(fracture);

    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     * We'll glue the name or requested outdir to the primary fracture outdir
     *
     **************************************************************************/

    const {
      isVersioned,
      namingStrategy,
      versionStrategy,
      typeStrategy,
      auditStrategy,
    } = fracture.options;

    let defaultOptions: Partial<ServiceOptions> = {
      outdir: join(fracture.options.outdir, options.outdir ?? options.name),
      isVersioned,
      namingStrategy,
      versionStrategy,
      typeStrategy,
      auditStrategy,
    };

    // add dynamo table definition if not supplied in options
    if (!options.dynamoTable) {
      options.dynamoTable = new DynamoTable(this, { name: options.name });
    }

    /***************************************************************************
     *
     * INIT SERVICE
     *
     **************************************************************************/

    // member components
    this.resources = [];

    // inverse
    this.fracture.services.push(this);

    // ensure name is param-cased
    const forcedOptions: Partial<ServiceOptions> = {
      name: paramCase(options.name),
    };

    // all other options
    this.options = deepMerge([
      defaultOptions,
      options,
      forcedOptions,
    ]) as Required<ServiceOptions>;

    return this;
  }

  public build() {
    this.resources.forEach((resource) => {
      resource.build();
    });
  }

  public get name(): string {
    return this.options.name;
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

  public get dynamoTable(): DynamoTable {
    return this.options.dynamoTable;
  }

  public get keyDynamoGsi(): DynamoGsi {
    return this.dynamoTable.keyDynamoGsi;
  }

  public get lookupDynamoGsi(): DynamoGsi {
    return this.dynamoTable.lookupDynamoGsi;
  }
}
