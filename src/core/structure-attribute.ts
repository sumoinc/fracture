import { paramCase } from "change-case";
import { Component } from "projen";
import { FractureService } from "./fracture-service";

export type StructureAttributeOptions = {
  /**
   * Full long name for this attribute.
   *
   * @example 'phone-number'
   */
  name: string;
  /**
   * Comment lines to add to the Resource.
   *
   * @default []
   */
  comments?: string[];
  /**
   * Is this attribute required?
   *
   * @default false
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
   * Comment lines to add to the Resource.
   *
   * @default []
   */
  public readonly comments: string[];
  /**
   * Is this attribute required?
   *
   * @default false
   */
  public readonly required: boolean;

  constructor(service: FractureService, options: StructureAttributeOptions) {
    super(service);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = paramCase(options.name);
    this.comments = options.comments ?? [];
    this.required = options.required ?? false;

    return this;
  }
}
