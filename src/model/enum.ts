import { paramCase } from "change-case";
import { EnumAttribute, EnumAttributeOptions } from "./enum-attribute";
import { FractureComponent } from "../core/component";
import { Service } from "../core/service";

export interface EnumShapeOptions {
  /**
   *  Name for the Enum.
   */
  name: string;
  /**
   * Comment lines to add to the Shape.
   * @default []
   */
  comment?: string[];
}

export class EnumShape extends FractureComponent {
  public readonly service: Service;
  public readonly name: string;
  private readonly _comment: string[];
  public attributes: EnumAttribute[];

  constructor(service: Service, options: EnumShapeOptions) {
    super(service.fracture);

    this.service = service;
    this.name = paramCase(options.name);
    this._comment = options.comment ?? [`A ${this.name}.`];

    this.attributes = [];
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
  public addEnumAttribute(options: EnumAttributeOptions) {
    const a = new EnumAttribute(this, options);
    this.attributes.push(a);
    return this;
  }
}
