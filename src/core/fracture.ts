import { Component, Project } from "projen";
import { AuditStrategy, defaultAuditStrategy } from "./audit-strategy";
import { FractureComponent } from "./component";
import { defaultNamingStrategy, NamingStrategy } from "./naming-strategy";
import {
  defaultPartitionKeyStrategy,
  PartitionKeyStrategy,
} from "./partition-key-strategy";
import { Service, ServiceOptions } from "./service";
import { defaultTypeStrategy, TypeStrategy } from "./type-strategy";
import {
  defaultVersioningStrategy,
  VersioningStrategy,
} from "./versioning-strategy";
import { Account, AccountOptions } from "../aws/account";
import { Organization, OrganizationOptions } from "../aws/organization";
import { Resource } from "../core/resource";

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
  versioningStrategy?: VersioningStrategy;
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
  public readonly versioningStrategy: VersioningStrategy;
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
    this.versioningStrategy =
      options.versioningStrategy ?? defaultVersioningStrategy;
    this.typeStrategy = options.typeStrategy ?? defaultTypeStrategy;
    this.auditStrategy = options.auditStrategy ?? defaultAuditStrategy;
  }

  /*****************************************************************************
   *
   *  GETTERS / HELPERS
   *
   ****************************************************************************/

  public get services(): Service[] {
    const isService = (c: FractureComponent): c is Service =>
      c instanceof Resource && c.namespace === this.namespace;
    return (this.project.components as FractureComponent[]).filter(isService);
  }

  public addService(options: ServiceOptions) {
    return new Service(this, options);
  }

  public addOrganization(options: OrganizationOptions) {
    new Organization(this, options);
    return this;
  }

  public addAccount(options: AccountOptions) {
    new Account(this, options);
    return this;
  }
}
