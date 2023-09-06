import { paramCase } from "change-case";
import { Component } from "projen";
import { ValueOf } from "type-fest";
import { ResourceAttributeType } from "./resource-attribute";
import { Service } from "./service";

export const StructureAttributeType = {
  ...ResourceAttributeType,
  ARRAY: "Array",
  CUSTOM: "Custom",
} as const;

export type StructureAttributeOptions = {
  /**
   * Full long name for this attribute.
   *
   * @example 'phone-number'
   */
  name: string;
  /**
   * Type for this structure attribute.
   *
   * @default StructureAttributeType.STRING
   */
  type?: ValueOf<typeof StructureAttributeType>;
  /**
   * Type parameter for this structure attribute.
   *
   * @default any
   * @example 'T' for MyType<T> generic
   */
  typeParameter?: string;
  /**
   * Comment lines to add to the Resource.
   *
   * @default []
   */
  comments?: string[];
  /**
   * Is this attribute required?
   *
   * @default true
   */
  required?: boolean;
};

export class StructureAttribute extends Component {
  /**
   * Full long name for this attribute.
   *
   * @example 'phone-number'
   */
  public readonly name: string;
  /**
   * Type for this structure attribute.
   *
   * @default StructureAttributeType.STRING
   */
  type: ValueOf<typeof StructureAttributeType>;
  /**
   * Type parameter for this structure attribute.
   *
   * @default any
   * @example 'T' for MyType<T> generic
   */
  public readonly typeParameter?: string;
  /**
   * Comment lines to add to the Resource.
   *
   * @default []
   */
  public readonly comments: string[];

  /**
   * Is this attribute required?
   *
   * @default true
   */
  public readonly required: boolean;

  constructor(
    public readonly project: Service,
    options: StructureAttributeOptions
  ) {
    super(project);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = paramCase(options.name);
    this.type = options.type ?? StructureAttributeType.STRING;
    this.typeParameter = options.typeParameter ?? "any";
    this.comments = options.comments ?? [];
    this.required = options.required ?? true;

    return this;
  }
}
