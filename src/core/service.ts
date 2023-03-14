import { join } from "path";
import { paramCase } from "change-case";
import { deepMerge } from "projen/lib/util";
import { Fracture, FractureComponent } from ".";
import { AuditStrategy } from "./audit-strategy";
import { NamingStrategy } from "./naming-strategy";
import { Resource, ResourceOptions } from "./resource";
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
   * The audit strategy to use for generated code.
   */
  auditStrategy?: AuditStrategy;
}

export class Service extends FractureComponent {
  // member components
  public readonly resources: Resource[] = [];
  public readonly dynamoTable: DynamoTable;
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

    const { isVersioned, namingStrategy, auditStrategy } = fracture.options;

    let defaultOptions: Partial<ServiceOptions> = {
      outdir: join(fracture.options.outdir, options.outdir ?? options.name),
      isVersioned,
      namingStrategy,
      auditStrategy,
    };

    /***************************************************************************
     *
     * INIT SERVICE
     *
     **************************************************************************/

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

    this.project.logger.info(`Service: "${this.name}" initialized.`);

    /***************************************************************************
     *
     * DYNAMO TABLE
     *
     * Add dynamo table per options defined in service definition
     *
     **************************************************************************/

    this.dynamoTable = new DynamoTable(this);

    return this;
  }

  public build() {
    this.project.logger.debug(`BUILD Service: "${this.name}" called.`);
    this.resources.forEach((resource) => {
      resource.build();
    });
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
