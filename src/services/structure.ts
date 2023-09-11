import { paramCase } from "change-case";
import { Component } from "projen";
import { TypeScriptProject } from "projen/lib/typescript/typescript.js";
import { DataService } from "./data-service.js";
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
  attributeOptions?: Omit<StructureAttributeOptions, "structure">[];
};

/******************************************************************************
 * CLASS
 *****************************************************************************/

export class Structure extends Component {
  /**
   * Returns a structure by name, or undefined if it doesn't exist
   */
  public static byName(
    service: DataService,
    name: string
  ): Structure | undefined {
    const isDefined = (c: Component): c is Structure =>
      c instanceof Structure && c.name === name;
    return service.structures.find(isDefined);
  }

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
  public readonly attributes: StructureAttribute[] = [];

  constructor(public readonly project: DataService, options: StructureOptions) {
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
     * Add to Service
     **************************************************************************/

    if (Structure.byName(this.service, this.name)) {
      throw new Error(
        `Resource "${this.service.name}" already has a structure named "${this.name}"`
      );
    }

    this.service.structures.push(this);

    return this;
  }

  /**
   * Add a single structure attribute to the structure.
   */
  public addAttribute(options: Omit<StructureAttributeOptions, "structure">) {
    const attribute = new StructureAttribute(this.project, {
      structure: this,
      ...options,
    });
    this.attributes.push(attribute);
    return attribute;
  }

  public get service() {
    return this.project;
  }
}
