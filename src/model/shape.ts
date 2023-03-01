import { paramCase, pascalCase } from "change-case";
import { AccessPattern } from "./access-pattern";
import { ShapeAttribute, ShapeAttributeOptions } from "./shape-attribute";
import { AuditStrategy } from "../core/audit-strategy";
import { FractureComponent } from "../core/component";
import { PartitionKeyStrategy } from "../core/partition-key-strategy";
import { Service } from "../core/service";
import { TypeStrategy } from "../core/type-strategy";
import { VersioningStrategy } from "../core/versioning-strategy";
import { TypeScriptInterface } from "../generators/ts/typescript-interface";

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
   * Should this shape be persisted to a database?
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

export class Shape extends FractureComponent {
  public readonly service: Service;
  public readonly name: string;
  public readonly shortName: string;
  private readonly _comment: string[];
  public readonly persistant: boolean;
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
      this.addShapeAttribute(this.partitionKeyStrategy);
    }

    /**
     * Add type attribute.
     */
    this.addShapeAttribute(this.typeStrategy);

    /**
     * Add the version attribute if versioned.
     */
    if (this.versioned && this.persistant) {
      this.addShapeAttribute(this.versioningStrategy.attribute);
    }

    /**
     * Add an (optional) Audit Strategies
     */
    if (this.auditStrategy.create.dateAttribute && this.persistant) {
      this.addShapeAttribute(this.auditStrategy.create.dateAttribute);
    }
    if (this.auditStrategy.create.userAttribute && this.persistant) {
      this.addShapeAttribute(this.auditStrategy.create.userAttribute);
    }
    if (this.auditStrategy.update.dateAttribute && this.persistant) {
      this.addShapeAttribute(this.auditStrategy.update.dateAttribute);
    }
    if (this.auditStrategy.update.userAttribute && this.persistant) {
      this.addShapeAttribute(this.auditStrategy.update.userAttribute);
    }
    if (this.auditStrategy.delete.dateAttribute && this.persistant) {
      this.addShapeAttribute(this.auditStrategy.delete.dateAttribute);
    }
    if (this.auditStrategy.delete.userAttribute && this.persistant) {
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
  public get partitionKeyAttributes(): ShapeAttribute[] {
    return this.attributes.filter((a) => a.isPartitionKey);
  }
  public get dataShapeAttributes(): ShapeAttribute[] {
    return this.attributes.filter((a) => a.isData);
  }
  public get listShapeAttributes(): ShapeAttribute[] {
    return this.attributes.filter((a) => a.isListInput);
  }

  preSynthesize() {
    new TypeScriptInterface(this);
    super.preSynthesize();
  }

  /**
   * Builds the names used by various parts of fracture when doing codegen.
   */
  /*
  public get names() {
    // we'll use this build the names of the commands
    const { commands, crud } = this.fracture.namingStrategy.operations;
    const { model } = this.fracture.namingStrategy;
    const { file } = this.fracture.namingStrategy.ts;

    // output command names
    return {
      ts: {
        create: {
          file: join(
            this.service.name,
            "commands",
            formatStringByNamingStrategy(
              `${commands.commandPrefix}-${crud.createName}-${this.name}-${commands.commandSuffix}`,
              file
            ) + ".ts"
          ),
          command: formatStringByNamingStrategy(
            `${commands.commandPrefix}-${crud.createName}-${this.name}-${commands.commandSuffix}`,
            model.shapeName
          ),
          input: formatStringByNamingStrategy(
            `${commands.inputPrefix}-${crud.createName}-${this.name}-${commands.inputSuffix}`,
            model.shapeName
          ),
          output: formatStringByNamingStrategy(
            `${commands.outputPrefix}-${crud.createName}-${this.name}-${commands.outputSuffix}`,
            model.shapeName
          ),
        },
        read: {
          command: formatStringByNamingStrategy(
            `${commands.commandPrefix}-${crud.readName}-${this.name}-${commands.commandSuffix}`,
            model.shapeName
          ),
          input: formatStringByNamingStrategy(
            `${commands.inputPrefix}-${crud.readName}-${this.name}-${commands.inputSuffix}`,
            model.shapeName
          ),
          output: formatStringByNamingStrategy(
            `${commands.outputPrefix}-${crud.readName}-${this.name}-${commands.outputSuffix}`,
            model.shapeName
          ),
        },
        update: {
          command: formatStringByNamingStrategy(
            `${commands.commandPrefix}-${crud.updateName}-${this.name}-${commands.commandSuffix}`,
            model.shapeName
          ),
          input: formatStringByNamingStrategy(
            `${commands.inputPrefix}-${crud.updateName}-${this.name}-${commands.inputSuffix}`,
            model.shapeName
          ),
          output: formatStringByNamingStrategy(
            `${commands.outputPrefix}-${crud.updateName}-${this.name}-${commands.outputSuffix}`,
            model.shapeName
          ),
        },
        delete: {
          command: formatStringByNamingStrategy(
            `${commands.commandPrefix}-${crud.deleteName}-${this.name}-${commands.commandSuffix}`,
            model.shapeName
          ),
          input: formatStringByNamingStrategy(
            `${commands.inputPrefix}-${crud.deleteName}-${this.name}-${commands.inputSuffix}`,
            model.shapeName
          ),
          output: formatStringByNamingStrategy(
            `${commands.outputPrefix}-${crud.deleteName}-${this.name}-${commands.outputSuffix}`,
            model.shapeName
          ),
        },
      },
    };
  }*/
}
