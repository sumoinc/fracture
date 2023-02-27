import { paramCase } from "change-case";
import { EnumShape } from "./enum";
import { FractureComponent } from "../core/component";

export type EnumAttributeOptions = {
  /**
   * Full long name for this attribute.
   * @example 'phone-number'
   */
  name: string;
  /**
   * Comment lines to add to the Shape.
   * @default []
   */
  comment?: string[];
};

export class EnumAttribute extends FractureComponent {
  public readonly enumShape: EnumShape;
  public readonly name: string;

  private readonly _comment: string[];

  constructor(enumShape: EnumShape, options: EnumAttributeOptions) {
    super(enumShape.fracture);

    this.enumShape = enumShape;
    this.name = paramCase(options.name);
    this._comment = options.comment ?? [`A ${this.name}.`];
  }

  /**
   * Get comment lines.
   */
  public get comment(): string[] {
    return this._comment;
  }
}
