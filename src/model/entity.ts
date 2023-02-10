import { paramCase } from "change-case";
import { Attribute, AttributeOptions, AttributeType } from "./attribute";
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

  constructor(fracture: Fracture, options: EntityOptions) {
    super(fracture);

    this.name = paramCase(options.name);
    this.shortName = options.shortName
      ? paramCase(options.shortName)
      : this.name;

    /**
     * These should become optional inputs later but hardcoding them for now.
     */

    this.addAttribute({ name: "id", type: AttributeType.GUID }); // entity id
    this.addAttribute({
      name: "createdAt",
      shortName: "_cd",
      type: AttributeType.DATE_TIME,
    }); // created timestamp
    this.addAttribute({
      name: "updatedAt",
      shortName: "_ud",
      type: AttributeType.DATE_TIME,
    }); // updated timestamp
    this.addAttribute({
      name: "deletedAt",
      shortName: "_dd",
      type: AttributeType.DATE_TIME,
    }); // deleted timestamp
    this.addAttribute({
      name: "version",
      shortName: "_v",
      type: AttributeType.DATE_TIME,
    }); // versioned by datestamp
    this.addAttribute({
      name: "ttl",
      shortName: "_ttl",
      type: AttributeType.INT,
    }); // expiration ttl
  }

  /**
   * Adds an attribute
   */
  public addAttribute(options: AttributeOptions) {
    new Attribute(this.fracture, options);
    return this;
  }
}
