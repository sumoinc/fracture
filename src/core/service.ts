import { join } from "path";
import { paramCase } from "change-case";
import { deepMerge } from "projen/lib/util";
import { AuditStrategy } from "./audit-strategy";
import { FractureComponent } from "./component";
import { Fracture } from "./fracture";
import { NamingStrategy } from "./naming-strategy";
import { Resource, ResourceOptions } from "./resource";
import { DynamoGsi } from "../dynamodb/dynamo-gsi";
import { DynamoTable } from "../dynamodb/dynamo-table";
import { TypescriptService } from "../generators/ts/typescript-service";

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
  // generators
  public readonly ts: TypescriptService;

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
      outdir: join(fracture.outdir, options.outdir ?? options.name),
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

    this.project.logger.info(`INIT Service: "${this.name}"`);

    /***************************************************************************
     *
     * DYNAMO TABLE
     *
     * Add dynamo table per options defined in service definition
     *
     **************************************************************************/

    this.dynamoTable = new DynamoTable(this);

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
