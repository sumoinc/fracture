import { paramCase } from "change-case";
import { Component } from "projen";
import { ValueOf } from "type-fest";
import {
  ResourceAttributeGenerator,
  ResourceAttributeType,
} from "./resource-attribute";
import { Service } from "./service";

export type StructureAttributeOptions = {
  /**
   * Full long name for this attribute.
   *
   * @example 'phone-number'
   */
  name: string;

  /**
   * Brief name used when storing data to save space.
   *
   * @example 'pn'
   * @default StructureAttributeOptions.name
   */
  shortName?: string;

  /**
   * Type for this structure attribute.
   *
   * @default ResourceAttributeType.STRING
   */
  type?: ValueOf<typeof ResourceAttributeType> | string;

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
  comments?: Array<string>;

  /**
   * Is this attribute required?
   *
   * @default true
   */
  required?: boolean;

  /**
   * The generator to use for the associated operation, if any
   *
   * @default ResourceAttributeGenerator.NONE
   */
  generator?: ValueOf<typeof ResourceAttributeGenerator>;
};

export class StructureAttribute extends Component {
  /**
   * Full long name for this attribute.
   *
   * @example 'phone-number'
   */
  public readonly name: string;

  /**
   * Brief name used when storing data to save space.
   *
   * @example 'pn'
   * @default StructureAttributeOptions.name
   */
  public readonly shortName: string;

  /**
   * Type for this structure attribute.
   *
   * @default ResourceAttributeType.STRING
   */
  public readonly type: ValueOf<typeof ResourceAttributeType> | string;

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

  /**
   * The generator to use for the associated operation, if any
   *
   * @default ResourceAttributeGenerator.NONE
   */
  public readonly generator: ValueOf<typeof ResourceAttributeGenerator>;

  constructor(
    public readonly project: Service,
    options: StructureAttributeOptions
  ) {
    super(project);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = paramCase(options.name);
    this.shortName = options.shortName ?? this.name;
    this.type = options.type ?? ResourceAttributeType.STRING;
    this.typeParameter = options.typeParameter ?? "any";
    this.comments = options.comments ?? [];
    this.required = options.required ?? true;
    this.generator = options.generator ?? ResourceAttributeGenerator.NONE;

    return this;
  }
}
