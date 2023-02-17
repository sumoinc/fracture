import { paramCase, pascalCase } from "change-case";
import {
  Attribute,
  AttributeGenerator,
  AttributeOptions,
  AttributeType,
} from "./attribute";
import { FractureComponent } from "../core/component";
import { Fracture } from "../core/fracture";
import { formatLabel } from "../lib/format-label";

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
      isKey: true,
      createGenerator: AttributeGenerator.GUID,
    });
    // created timestamp
    this.addAttribute({
      name: "createdAt",
      shortName: "cd",
      comment: [`The date and time this ${this.name} was created.`],
      type: AttributeType.DATE_TIME,
      createGenerator: AttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    // updated timestamp
    this.addAttribute({
      name: "updatedAt",
      shortName: "ud",
      comment: [`The date and time this ${this.name} was last updated.`],
      type: AttributeType.DATE_TIME,
      updateGenerator: AttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    // deleted timestamp
    this.addAttribute({
      name: "deletedAt",
      shortName: "dd",
      comment: [`The date and time this ${this.name} was deleted.`],
      type: AttributeType.DATE_TIME,
      deleteGenerator: AttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    // versioned by datestamp
    this.addAttribute({
      name: "version",
      shortName: "v",
      comment: [
        `The date and time this ${this.name} version was created, or "LATEST" for the most recent version.`,
      ],
      type: AttributeType.STRING,
      createGenerator: AttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    // versioned by datestamp
    this.addAttribute({
      name: "type",
      shortName: "t",
      comment: [`The type for this ${this.name}.`],
      type: AttributeType.STRING,
      createGenerator: AttributeGenerator.TYPE,
    });
    // remote id, if imported
    // this.addAttribute({
    //   name: "remote-id",
    //   shortName: "_rid",
    //   comment: [
    //     `For imported records, the external/remote unique identifier for this ${this.name}.`,
    //   ],
    //   type: AttributeType.GUID,
    //   isRemoteKey: true,
    // });
    // // remote creation date, if imported
    // this.addAttribute({
    //   name: "remote-created-at",
    //   shortName: "_rcd",
    //   comment: [
    //     `For imported records, the external/remote creation timestamp for this ${this.name}.`,
    //   ],
    //   type: AttributeType.DATE_TIME,
    //   isRemoteField: true,
    // });
    // // remote updated date, if imported
    // this.addAttribute({
    //   name: "remote-updated-at",
    //   shortName: "_rud",
    //   comment: [
    //     `For imported records, the external/remote last updated timestamp for this ${this.name}.`,
    //   ],
    //   type: AttributeType.DATE_TIME,
    //   isRemoteField: true,
    // });
    // // remote version, if imported
    // this.addAttribute({
    //   name: "remote-version",
    //   shortName: "_rv",
    //   comment: [
    //     `For imported records, the external/remote version for this ${this.name}.`,
    //   ],
    //   type: AttributeType.STRING,
    //   isRemoteField: true,
    // });
  }

  /**
   * Get name based on naming strategy.
   */
  public get name(): string {
    return formatLabel(
      this._name,
      this.fracture.typeScriptNamingStrategy.namingStrategy.entityStrategy
    );
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

  /**
   * Attributes used in crud operations and commands
   */
  public get keyAttributes(): Attribute[] {
    return this.attributes.filter((a) => a.isKey);
  }
  public get dataAttributes(): Attribute[] {
    return this.attributes.filter((a) => a.isData);
  }
  public get listAttributes(): Attribute[] {
    return this.attributes.filter((a) => a.isListInput);
  }
}
