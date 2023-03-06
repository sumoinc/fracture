import { Component, Project } from "projen";
import { AuditStrategy, defaultAuditStrategy } from "./audit-strategy";
import { FractureComponent } from "./component";
import { defaultNamingStrategy, NamingStrategy } from "./naming-strategy";
import { Organization, OrganizationOptions } from "./organization";
import {
  defaultPartitionKeyStrategy,
  PartitionKeyStrategy,
} from "./partition-key-strategy";
import { Service, ServiceOptions } from "./service";
import { defaultTypeStrategy, TypeStrategy } from "./type-strategy";
import { defaultVersionStrategy, VersionStrategy } from "./version-strategy";

export interface FractureOptions {
  /**
   * Directory where generated code will be placed.
   * @default project.outdir + "/" + namespace
   */
  outdir?: string;
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
   * Versioned.
   * @default true
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
/**
 * The root of the entire application.
 */
export class Fracture extends Component {
  public readonly project: Project;
  public readonly namespace: string;
  public readonly outdir: string;
  public readonly namingStrategy: NamingStrategy;
  public readonly partitionKeyStrategy: PartitionKeyStrategy;
  public readonly versioned: boolean;
  public readonly versionStrategy: VersionStrategy;
  public readonly typeStrategy: TypeStrategy;
  public readonly auditStrategy: AuditStrategy;

  constructor(
    project: Project,
    namespace: string = "fracture",
    options: FractureOptions = {}
  ) {
    super(project);

    /***************************************************************************
     *
     *  INIT FRACTURE PROJECT
     *
     **************************************************************************/

    this.project = project;
    this.namespace = namespace;
    this.outdir = options.outdir ?? namespace;
    this.namingStrategy = options.namingStrategy ?? defaultNamingStrategy;
    this.partitionKeyStrategy =
      options.partitionKeyStrategy ?? defaultPartitionKeyStrategy;
    this.versioned = options.versioned ?? true;
    this.versionStrategy = options.versionStrategy ?? defaultVersionStrategy;
    this.typeStrategy = options.typeStrategy ?? defaultTypeStrategy;
    this.auditStrategy = options.auditStrategy ?? defaultAuditStrategy;
  }

  /**
   * Build the project.
   *
   * Call this when you've configured everything, prior to preSynthesize
   *  @returns void
   */
  public build() {
    this.services.forEach((s) => s.build());
  }

  /*****************************************************************************
   *
   *  Fracture Component Helpers
   *
   ****************************************************************************/

  public get services(): Service[] {
    const isService = (c: FractureComponent): c is Service =>
      c instanceof Service && c.namespace === this.namespace;
    return (this.project.components as FractureComponent[]).filter(isService);
  }

  public get organizations(): Organization[] {
    const isOrganization = (c: FractureComponent): c is Organization =>
      c instanceof Organization && c.namespace === this.namespace;
    return (this.project.components as FractureComponent[]).filter(
      isOrganization
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
