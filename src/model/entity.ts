import { paramCase } from "change-case";
import {
  Attribute,
  AttributeGenerator,
  AttributeOptions,
  AttributeType,
} from "./attribute";
import { FractureComponent } from "../core/component";
import { Fracture } from "../core/fracture";

export interface EntityOptions {
  /**
   *  Name for the Entity.
   */
  name: string;
  /**
   * Short name for the Entity.
   */
  shortName?: string;
}

export class Entity extends FractureComponent {
  public readonly name: string;
  public readonly shortName: string;
  public attributes: Attribute[];

  constructor(fracture: Fracture, options: EntityOptions) {
    super(fracture);

    this.name = paramCase(options.name);
    this.shortName = options.shortName
      ? paramCase(options.shortName)
      : this.name;

    this.attributes = [];

    /**
     * These should become optional inputs later but hardcoding them for now.
     */
    // entity id
    this.addAttribute({
      name: "id",
      type: AttributeType.GUID,
      createGenerator: AttributeGenerator.GUID,
    });
    // created timestamp
    this.addAttribute({
      name: "createdAt",
      shortName: "_cd",
      type: AttributeType.DATE_TIME,
      createGenerator: AttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    // updated timestamp
    this.addAttribute({
      name: "updatedAt",
      shortName: "_ud",
      type: AttributeType.DATE_TIME,
      updateGenerator: AttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    // deleted timestamp
    this.addAttribute({
      name: "deletedAt",
      shortName: "_dd",
      type: AttributeType.DATE_TIME,
      deleteGenerator: AttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    // versioned by datestamp
    this.addAttribute({
      name: "version",
      shortName: "_v",
      type: AttributeType.DATE_TIME,
      createGenerator: AttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    // versioned by datestamp
    this.addAttribute({
      name: "type",
      shortName: "_t",
      type: AttributeType.STRING,
      createGenerator: AttributeGenerator.TYPE,
    });
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
