import { join } from "path";
import { paramCase, pascalCase } from "change-case";
import { AccessPattern } from "./access-pattern";
import { AuditStrategy } from "./audit-strategy";
import { FractureComponent } from "./component";
import {
  formatStringByNamingStrategy,
  NAMING_STRATEGY_TYPE,
} from "./naming-strategy";
import { Operation, OPERATION_SUB_TYPE, OPERATION_TYPE } from "./operation";
import { PartitionKeyStrategy } from "./partition-key-strategy";
import {
  ResourceAttribute,
  ResourceAttributeOptions,
} from "./resource-attribute";
import { Service } from "./service";
import { TypeStrategy } from "./type-strategy";
import { VersioningStrategy } from "./versioning-strategy";
import { TypeScriptLambdaCommands } from "../generators/ts/lambda-commands/lambda-commands";
import { TypeScriptInterfaces } from "../generators/ts/typescript-interfaces";

export interface ResourceOptions {
  /**
   *  Name for the Resource.
   */
  name: string;
  /**
   * Short name for the Resource.
   */
  shortName?: string;
  /**
   * Comment lines to add to the Resource.
   * @default []
   */
  comment?: string[];
  /**
   * Should this resource be persisted to a database?
   * @default true
   */
  persistant?: boolean;
  /**
   * The type strategy to use for the partition key.
   */
  partitionKeyStrategy?: PartitionKeyStrategy;
  /**
   * Versioned.
   * @default service's default
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

export class Resource extends FractureComponent {
  public readonly service: Service;
  public readonly name: string;
  public readonly shortName: string;
  public readonly outdir: string;
  private readonly _comment: string[];
  public readonly persistant: boolean;
  public readonly partitionKeyStrategy: PartitionKeyStrategy;
  public readonly versioned: boolean;
  public readonly versioningStrategy: VersioningStrategy;
  public readonly typeStrategy: TypeStrategy;
  public readonly auditStrategy: AuditStrategy;
  public attributes: ResourceAttribute[];
  public keyPattern: AccessPattern;

  constructor(service: Service, options: ResourceOptions) {
    super(service.fracture);

    this.service = service;
    this.name = paramCase(options.name);
    this.shortName = options.shortName
      ? pascalCase(options.shortName).toLowerCase()
      : pascalCase(options.name).toLowerCase();
    this.outdir = join(service.outdir, this.name);
    this._comment = options.comment ?? [`A ${this.name}.`];
    this.persistant = options.persistant ?? true;
    this.partitionKeyStrategy =
      options.partitionKeyStrategy ?? service.partitionKeyStrategy;
    this.versioned = options.versioned ?? service.versioned;
    this.versioningStrategy =
      options.versioningStrategy ?? service.versioningStrategy;
    this.typeStrategy = options.typeStrategy ?? service.typeStrategy;
    this.auditStrategy = options.auditStrategy ?? service.auditStrategy;

    this.attributes = [];

    /**
     * Add the partition key attribute.
     */
    if (this.persistant) {
      this.addResourceAttribute(this.partitionKeyStrategy);
    }

    /**
     * Add type attribute.
     */
    this.addResourceAttribute(this.typeStrategy);

    /**
     * Add the version attribute if versioned.
     */
    if (this.versioned && this.persistant) {
      this.addResourceAttribute(this.versioningStrategy.attribute);
    }

    /**
     * Add an (optional) Audit Strategies
     */
    if (this.auditStrategy.create.dateAttribute && this.persistant) {
      this.addResourceAttribute(this.auditStrategy.create.dateAttribute);
    }
    if (this.auditStrategy.create.userAttribute && this.persistant) {
      this.addResourceAttribute(this.auditStrategy.create.userAttribute);
    }
    if (this.auditStrategy.update.dateAttribute && this.persistant) {
      this.addResourceAttribute(this.auditStrategy.update.dateAttribute);
    }
    if (this.auditStrategy.update.userAttribute && this.persistant) {
      this.addResourceAttribute(this.auditStrategy.update.userAttribute);
    }
    if (this.auditStrategy.delete.dateAttribute && this.persistant) {
      this.addResourceAttribute(this.auditStrategy.delete.dateAttribute);
    }
    if (this.auditStrategy.delete.userAttribute && this.persistant) {
      this.addResourceAttribute(this.auditStrategy.delete.userAttribute);
    }

    // default access pattern for now

    this.keyPattern = new AccessPattern(this, {
      pk: ["id"],
      sk: ["type", "version"],
    });
  }

  public build() {
    /**
     * ADD CRUD OPERATIONS
     */
    new Operation(this, {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.CREATE_ONE,
    });
    new Operation(this, {
      operationType: OPERATION_TYPE.QUERY,
      operationSubType: OPERATION_SUB_TYPE.READ_ONE,
    });
    new Operation(this, {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.UPDATE_ONE,
    });
    new Operation(this, {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.DELETE_ONE,
    });
    new Operation(this, {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.IMPORT_ONE,
    });
  }

  /**
   * Get comment lines.
   */
  public get comment(): string[] {
    return this._comment;
  }

  public get interfaceName() {
    return formatStringByNamingStrategy(
      this.name,
      NAMING_STRATEGY_TYPE.PASCAL_CASE
    );
  }

  public get interfaceNameDynamo() {
    return formatStringByNamingStrategy(
      `dynamo-${this.name}`,
      NAMING_STRATEGY_TYPE.PASCAL_CASE
    );
  }

  /**
   * Get all resources for this service.
   */
  public get operations(): Operation[] {
    const isOperation = (c: FractureComponent): c is Operation =>
      c instanceof Operation &&
      c.namespace === this.namespace &&
      c.resource.service.name === this.name &&
      c.resource.name === this.name;
    return (this.project.components as FractureComponent[]).filter(isOperation);
  }

  /**
   * Adds an attribute
   */
  public addResourceAttribute(options: ResourceAttributeOptions) {
    const a = new ResourceAttribute(this, options);
    this.attributes.push(a);
    return this;
  }

  /**
   * ResourceAttributes used in crud operations and commands
   */
  public get partitionKeyAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isPartitionKey);
  }
  public get dataAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isData);
  }
  public get listAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isListInput);
  }
  // generated attrubutes
  public get createGeneratedAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isCreateGenerated);
  }
  public get readGeneratedAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isReadGenerated);
  }
  public get updateGeneratedAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isUpdateGenerated);
  }
  public get deleteGeneratedAttributes(): ResourceAttribute[] {
    return this.attributes.filter((a) => a.isDeleteGenerated);
  }

  /**
   * Build default operations
   */

  preSynthesize() {
    new TypeScriptInterfaces(this);
    new TypeScriptLambdaCommands(this);
    super.preSynthesize();
  }
}