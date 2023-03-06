import { join } from "path";
import { Fracture, FractureComponent } from ".";
import { AuditStrategy } from "./audit-strategy";
import { PartitionKeyStrategy } from "./partition-key-strategy";
import { Resource, ResourceOptions } from "./resource";
import { TypeStrategy } from "./type-strategy";
import { VersionStrategy } from "./version-strategy";
import { Table } from "../dynamodb/table";
import { TypeScriptInterfaces } from "../generators/ts/typescript-interfaces";
import { TypeScriptSource } from "../generators/ts/typescript-source";

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

  public build() {
    this.resources.forEach((r) => r.build());
  }

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

  public addResource(options: ResourceOptions) {
    return new Resource(this, options);
  }

  public get tsInterfaceFile(): TypeScriptInterfaces {
    const isInterfaceFile = (c: TypeScriptSource): c is TypeScriptInterfaces =>
      c instanceof TypeScriptInterfaces &&
      c.resource.namespace === this.namespace;
    const interfaceFile = (
      this.project.components as TypeScriptSource[]
    ).filter(isInterfaceFile);
    return interfaceFile[0];
  }
}
