import { camelCase, paramCase, pascalCase } from "change-case";
import {
  Attribute,
  AttributeGenerator,
  AttributeOptions,
  AttributeType,
} from "./attribute";
import { FractureComponent } from "../core/component";
import { Fracture, NamingStrategyType } from "../core/fracture";

export interface EntityOptions {
  /**
   *  Name for the Entity.
   */
  name: string;
  /**
   * Short name for the Entity.
   */
  shortName?: string;
  /**
   * Comment lines to add to the Entity.
   * @default []
   */
  comment?: string[];
}

export class Entity extends FractureComponent {
  private readonly _name: string;
  private readonly _shortName: string;
  private readonly _comment: string[];
  public attributes: Attribute[];

  constructor(fracture: Fracture, options: EntityOptions) {
    super(fracture);

    this._name = paramCase(options.name);
    this._shortName = options.shortName
      ? paramCase(options.shortName)
      : this._name;
    this._comment = options.comment ?? [`A ${this.name}.`];

    this.attributes = [];

    /**
     * These should become optional inputs later but hardcoding them for now.
     */
    // entity id
    this.addAttribute({
      name: "id",
      comment: [`The unique identifier for this ${this.name}.`],
      type: AttributeType.GUID,
      createGenerator: AttributeGenerator.GUID,
    });
    // created timestamp
    this.addAttribute({
      name: "createdAt",
      shortName: "_cd",
      comment: [`The date and time this ${this.name} was created.`],
      type: AttributeType.DATE_TIME,
      createGenerator: AttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    // updated timestamp
    this.addAttribute({
      name: "updatedAt",
      shortName: "_ud",
      comment: [`The date and time this ${this.name} was last updated.`],
      type: AttributeType.DATE_TIME,
      updateGenerator: AttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    // deleted timestamp
    this.addAttribute({
      name: "deletedAt",
      shortName: "_dd",
      comment: [`The date and time this ${this.name} was deleted.`],
      type: AttributeType.DATE_TIME,
      deleteGenerator: AttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    // versioned by datestamp
    this.addAttribute({
      name: "version",
      shortName: "_v",
      comment: [
        `The date and time this ${this.name} version was created, or "LATEST" for the most recent version.`,
      ],
      type: AttributeType.STRING,
      createGenerator: AttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    // versioned by datestamp
    this.addAttribute({
      name: "type",
      shortName: "_t",
      comment: [`The type for this ${this.name}.`],
      type: AttributeType.STRING,
      createGenerator: AttributeGenerator.TYPE,
    });
  }

  /**
   * Get name based on naming strategy.
   */
  public get name(): string {
    switch (this.fracture.namingStrategy.entityStrategy) {
      case NamingStrategyType.PASCAL_CASE:
        return pascalCase(this._name);
        break;
      case NamingStrategyType.CAMEL_CASE:
        return camelCase(this._name);
      default:
        throw new Error(
          `Invalid naming strategy ${this.fracture.namingStrategy.entityStrategy}`
        );
        break;
    }
  }

  /**
   * Get shortName, no dashes, all lowercase
   */
  public get shortName(): string {
    return pascalCase(this._shortName).toLowerCase();
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
  public addAttribute(options: AttributeOptions) {
    const a = new Attribute(this, options);
    this.attributes.push(a);
    return this;
  }
}
