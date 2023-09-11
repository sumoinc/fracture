import { paramCase } from "change-case";
import { Component } from "projen";
import { TypeScriptProject } from "projen/lib/typescript/typescript.js";
import { Service } from "./service.js";
import {
  StructureAttribute,
  StructureAttributeOptions,
} from "./structure-attribute";

/******************************************************************************
 * TYPES
 *****************************************************************************/

export type StructureOptions = {
  /**
   *  Name for the structure.
   */
  name: string;
  /**
   * Type parameter for this structure type.
   *
   * @default undefined
   * @example 'T' for MyType<T> generic
   */
  typeParameter?: string;
  /**
   * Comment lines to add to the Structure.
   *
   * @default []
   */
  comments?: string[];
  /**
   * Options for attributes to add when initializing the structure.
   */
  attributeOptions?: StructureAttributeOptions[];
};

/******************************************************************************
 * CLASS
 *****************************************************************************/

export class Structure extends Component {
  /**
   * Returns all structures for service
   */
  public static all(project: TypeScriptProject): Structure[] {
    const isDefined = (c: Component): c is Structure => c instanceof Structure;
    return project.components.filter(isDefined);
  }

  /**
   *  Name for the structure.
   */
  public readonly name: string;
  /**
   * Type parameter for this structure type.
   *
   * @default undefined
   * @example 'T' for MyType<T> generic
   */
  public readonly typeParameter?: string;
  /**
   * Comment lines to add to the Structure.
   *
   * @default []
   */
  public readonly comments: string[];
  /**
   * All attributes in this structure.
   */
  public attributes: StructureAttribute[] = [];

  constructor(public readonly project: Service, options: StructureOptions) {
    super(project);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = paramCase(options.name);
    this.typeParameter = options.typeParameter;
    this.comments = options.comments ?? [];

    if (options.attributeOptions) {
      options.attributeOptions.forEach((attributeOption) => {
        this.addAttribute(attributeOption);
      });
    }

    /***************************************************************************
     *
     * GENERATORS
     *
     **************************************************************************/

    //this.ts = new TypescriptStructure(this);

    return this;
  }

  public addAttribute(options: StructureAttributeOptions) {
    const attribute = new StructureAttribute(this.project, options);
    this.attributes.push(attribute);
    return attribute;
  }
}
