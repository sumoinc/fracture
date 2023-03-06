import { join } from "path";
import { Fracture, FractureComponent } from ".";
import { AuditStrategy } from "./audit-strategy";
import { PartitionKeyStrategy } from "./partition-key-strategy";
import { Resource, ResourceOptions } from "./resource";
import { TypeStrategy } from "./type-strategy";
import { VersionStrategy } from "./version-strategy";
import { Table } from "../dynamodb/table";

export interface ServiceOptions {
  name: string;
  /**
   * The type strategy to use for the partition key.
   */
  partitionKeyStrategy?: PartitionKeyStrategy;
  /**
   * Versioned.
   * @default fracture default
   */
  versioned?: boolean;
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

export class Service extends FractureComponent {
  public readonly name: string;
  public readonly outdir: string;
  public readonly partitionKeyStrategy: PartitionKeyStrategy;
  public readonly versioned: boolean;
  public readonly versionStrategy: VersionStrategy;
  public readonly typeStrategy: TypeStrategy;
  public readonly auditStrategy: AuditStrategy;
  public readonly dynamodb: Table;

  constructor(fracture: Fracture, options: ServiceOptions) {
    super(fracture);

    this.name = options.name;
    this.outdir = join(fracture.outdir, this.name);
    this.partitionKeyStrategy =
      options.partitionKeyStrategy ?? fracture.partitionKeyStrategy;
    this.versioned = options.versioned ?? fracture.versioned;
    this.versionStrategy = options.versionStrategy ?? fracture.versionStrategy;
    this.typeStrategy = options.typeStrategy ?? fracture.typeStrategy;
    this.auditStrategy = options.auditStrategy ?? fracture.auditStrategy;

    // each service gets it's own dynamodb table
    this.dynamodb = new Table(this, { name: this.name });
  }

  /**
   * Build the project.
   *
   * Call this when you've configured everything, prior to preSynthesize
   * Called by Fracture.build()
   * @returns void
   */
  public build() {
    this.resources.forEach((r) => r.build());
  }

  /*****************************************************************************
   *
   *  Fracture Component Helpers
   *
   ****************************************************************************/

  /**
   * Get all resources for this service.
   */
  public get resources(): Resource[] {
    const isResource = (c: FractureComponent): c is Resource =>
      c instanceof Resource &&
      c.namespace === this.namespace &&
      c.service.name === this.name;
    return (this.project.components as FractureComponent[]).filter(isResource);
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
}
