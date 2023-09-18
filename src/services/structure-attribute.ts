import { paramCase } from "change-case";
import { Component } from "projen";
import { ValueOf } from "type-fest";
import {
  ResourceAttributeGenerator,
  ResourceAttributeType,
} from "./resource-attribute";
import { Service } from "./service";
import { Structure } from "./structure";

export type StructureAttributeOptions = {
  /**
   * The structure this attribute belongs to.
   *
   * @default undefined
   */
  readonly structure?: Structure;

  /**
   * Full long name for this attribute.
   *
   * @example 'phone-number'
   */
  readonly name: string;

  /**
   * Brief name used when storing data to save space.
   *
   * @example 'pn'
   * @default StructureAttributeOptions.name
   */
  readonly shortName?: string;

  /**
   * Type for this structure attribute.
   *
   * @default ResourceAttributeType.STRING
   */
  readonly type?: ValueOf<typeof ResourceAttributeType> | string;

  /**
   * Type parameter for this structure attribute.
   *
   * @default undefined
   * @example 'T' for MyType<T> generic
   */
  readonly typeParameter?: string;

  /**
   * Comment lines to add to the Resource.
   *
   * @default []
   */
  readonly comments?: Array<string>;

  /**
   * Is this attribute required?
   *
   * @default true
   */
  readonly required?: boolean;

  /**
   * The generator to use for the associated operation, if any
   *
   * @default ResourceAttributeGenerator.NONE
   */
  readonly generator?: ValueOf<typeof ResourceAttributeGenerator>;
};

export class StructureAttribute extends Component {
  /**
   * Returns a structure by name, or undefined if it doesn't exist
   */
  public static byName(
    structure: Structure,
    name: string
  ): StructureAttribute | undefined {
    const isDefined = (c: Component): c is StructureAttribute =>
      c instanceof StructureAttribute && c.name === name;
    return structure.attributes.find(isDefined);
  }

  /**
   * The structure this attribute belongs to.
   *
   * @default undefined
   */
  readonly structure?: Structure;

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
   * @default undefined
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

    this.structure = options.structure;
    this.name = paramCase(options.name);
    this.shortName = options.shortName ?? this.name;
    this.type = options.type ?? ResourceAttributeType.STRING;
    this.typeParameter = options.typeParameter;
    this.comments = options.comments ?? [];
    this.required = options.required ?? true;
    this.generator = options.generator ?? ResourceAttributeGenerator.NONE;

    /***************************************************************************
     * Add to Structure
     **************************************************************************/

    if (this.structure) {
      if (StructureAttribute.byName(this.structure, this.name)) {
        throw new Error(
          `Resource "${this.structure.name}" already has an attribute named "${this.name}"`
        );
      }
      this.structure.attributes.push(this);
    }

    return this;
  }

  /***************************************************************************
   * Configuration export for this structure
   **************************************************************************/

  public config(): Record<string, any> {
    return {
      name: this.name,
      shortName: this.shortName,
      type: this.type,
      typeParameter: this.typeParameter,
      comments: this.comments,
      required: this.required,
      generator: this.generator,
    };
  }
}
