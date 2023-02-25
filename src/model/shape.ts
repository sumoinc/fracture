import { paramCase, pascalCase } from "change-case";
import { AccessPattern } from "./access-pattern";
import {
  ShapeAttribute,
  ShapeAttributeGenerator,
  ShapeAttributeOptions,
  ShapeAttributeType,
} from "./attribute";
import { FractureComponent } from "../core/component";
import { Service } from "../core/service";

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
}

export class Shape extends FractureComponent {
  public readonly service: Service;
  public readonly name: string;
  public readonly shortName: string;
  private readonly _comment: string[];
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

    this.attributes = [];

    /**
     * These should become optional inputs later but hardcoding them for now.
     */
    // shape id
    this.addShapeAttribute({
      name: "id",
      comment: [`The unique identifier for this ${this.name}.`],
      type: ShapeAttributeType.GUID,
      isKey: true,
      createGenerator: ShapeAttributeGenerator.GUID,
    });
    // created timestamp
    this.addShapeAttribute({
      name: "createdAt",
      shortName: "cd",
      comment: [`The date and time this ${this.name} was created.`],
      type: ShapeAttributeType.DATE_TIME,
      createGenerator: ShapeAttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    // updated timestamp
    this.addShapeAttribute({
      name: "updatedAt",
      shortName: "ud",
      comment: [`The date and time this ${this.name} was last updated.`],
      type: ShapeAttributeType.DATE_TIME,
      updateGenerator: ShapeAttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    // deleted timestamp
    this.addShapeAttribute({
      name: "deletedAt",
      shortName: "dd",
      comment: [`The date and time this ${this.name} was deleted.`],
      type: ShapeAttributeType.DATE_TIME,
      deleteGenerator: ShapeAttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    // versioned by datestamp
    this.addShapeAttribute({
      name: "version",
      shortName: "v",
      comment: [
        `The date and time this ${this.name} version was created, or "LATEST" for the most recent version.`,
      ],
      type: ShapeAttributeType.STRING,
      createGenerator: ShapeAttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    // versioned by datestamp
    this.addShapeAttribute({
      name: "type",
      shortName: "t",
      comment: [`The type for this ${this.name}.`],
      type: ShapeAttributeType.STRING,
      createGenerator: ShapeAttributeGenerator.TYPE,
    });
    // remote id, if imported
    // this.addShapeAttribute({
    //   name: "remote-id",
    //   shortName: "_rid",
    //   comment: [
    //     `For imported records, the external/remote unique identifier for this ${this.name}.`,
    //   ],
    //   type: ShapeAttributeType.GUID,
    //   isRemoteKey: true,
    // });
    // // remote creation date, if imported
    // this.addShapeAttribute({
    //   name: "remote-created-at",
    //   shortName: "_rcd",
    //   comment: [
    //     `For imported records, the external/remote creation timestamp for this ${this.name}.`,
    //   ],
    //   type: ShapeAttributeType.DATE_TIME,
    //   isRemoteField: true,
    // });
    // // remote updated date, if imported
    // this.addShapeAttribute({
    //   name: "remote-updated-at",
    //   shortName: "_rud",
    //   comment: [
    //     `For imported records, the external/remote last updated timestamp for this ${this.name}.`,
    //   ],
    //   type: ShapeAttributeType.DATE_TIME,
    //   isRemoteField: true,
    // });
    // // remote version, if imported
    // this.addShapeAttribute({
    //   name: "remote-version",
    //   shortName: "_rv",
    //   comment: [
    //     `For imported records, the external/remote version for this ${this.name}.`,
    //   ],
    //   type: ShapeAttributeType.STRING,
    //   isRemoteField: true,
    // });

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
