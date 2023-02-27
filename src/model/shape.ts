import { paramCase, pascalCase } from "change-case";
import { AccessPattern } from "./access-pattern";
import { ShapeAttribute, ShapeAttributeOptions } from "./attribute";
import { AuditStrategy } from "../core/audit-strategy";
import { FractureComponent } from "../core/component";
import { PartitionKeyStrategy } from "../core/partition-key-strategy";
import { Service } from "../core/service";
import { TypeStrategy } from "../core/type-strategy";
import { VersioningStrategy } from "../core/versioning-strategy";

export interface ShapeOptions {
  /**
   *  Name for the Shape.
   */
  name: string;
  /**
   * Short name for the Shape.
   */
  shortName?: string;
  /**
   * Comment lines to add to the Shape.
   * @default []
   */
  comment?: string[];
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

export class Shape extends FractureComponent {
  public readonly service: Service;
  public readonly name: string;
  public readonly shortName: string;
  private readonly _comment: string[];
  public readonly partitionKeyStrategy: PartitionKeyStrategy;
  public readonly versioned: boolean;
  public readonly versioningStrategy: VersioningStrategy;
  public readonly typeStrategy: TypeStrategy;
  public readonly auditStrategy: AuditStrategy;
  public attributes: ShapeAttribute[];
  public keyPattern: AccessPattern;

  constructor(service: Service, options: ShapeOptions) {
    super(service.fracture);

    this.service = service;
    this.name = paramCase(options.name);
    this.shortName = options.shortName
      ? pascalCase(options.shortName).toLowerCase()
      : pascalCase(options.name).toLowerCase();
    this._comment = options.comment ?? [`A ${this.name}.`];
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
    this.addShapeAttribute(this.partitionKeyStrategy);

    /**
     * Add type attribute.
     */
    this.addShapeAttribute(this.typeStrategy);

    /**
     * Add the version attribute if versioned.
     */
    if (this.versioned) {
      this.addShapeAttribute(this.versioningStrategy.attribute);
    }

    /**
     * Add an (optional) Audit Strategies
     */
    if (this.auditStrategy.create.dateAttribute) {
      this.addShapeAttribute(this.auditStrategy.create.dateAttribute);
    }
    if (this.auditStrategy.create.userAttribute) {
      this.addShapeAttribute(this.auditStrategy.create.userAttribute);
    }
    if (this.auditStrategy.update.dateAttribute) {
      this.addShapeAttribute(this.auditStrategy.update.dateAttribute);
    }
    if (this.auditStrategy.update.userAttribute) {
      this.addShapeAttribute(this.auditStrategy.update.userAttribute);
    }
    if (this.auditStrategy.delete.dateAttribute) {
      this.addShapeAttribute(this.auditStrategy.delete.dateAttribute);
    }
    if (this.auditStrategy.delete.userAttribute) {
      this.addShapeAttribute(this.auditStrategy.delete.userAttribute);
    }

    // default access pattern for now
    this.keyPattern = new AccessPattern(this, {
      pk: ["id"],
      sk: ["type", "version"],
    });
  }

  /**
   * Get comment lines.
   */
  public get comment(): string[] {
    return this._comment;
  }

  /**
   * Adds an attribute
   */
  public addShapeAttribute(options: ShapeAttributeOptions) {
    const a = new ShapeAttribute(this, options);
    this.attributes.push(a);
    return this;
  }

  /**
   * ShapeAttributes used in crud operations and commands
   */
  public get keyShapeAttributes(): ShapeAttribute[] {
    return this.attributes.filter((a) => a.isKey);
  }
  public get dataShapeAttributes(): ShapeAttribute[] {
    return this.attributes.filter((a) => a.isData);
  }
  public get listShapeAttributes(): ShapeAttribute[] {
    return this.attributes.filter((a) => a.isListInput);
  }
}
