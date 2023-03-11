import { deepMerge } from "projen/lib/util";
import { ValueOf } from "type-fest";
import { FractureComponent } from "./component";
import { Resource } from "./resource";
import {
  ResourceAttribute,
  ResourceAttributeGenerator,
  ResourceAttributeOptions,
} from "./resource-attribute";
import { Service } from "./service";
import { Structure } from "./structure";

/******************************************************************************
 * TYPES
 *****************************************************************************/

export const STRUCTURE_ATTRIBUTE_TYPE = {
  PUBLIC: "public",
  PRIVATE: "private",
} as const;

export interface StructureAttributeOptions extends ResourceAttributeOptions {
  /**
   * Is this a public or private attribute?
   */
  structureAttributeType: ValueOf<typeof STRUCTURE_ATTRIBUTE_TYPE>;
}

/******************************************************************************
 * CLASS
 *****************************************************************************/

export class StructureAttribute extends FractureComponent {
  // member components
  public readonly compositionSources: StructureAttribute[];
  // parent
  public readonly structure: Structure;

  // all other options
  public readonly options: Required<StructureAttributeOptions>;

  constructor(
    structure: Structure,
    resourceAttribute: ResourceAttribute,
    options: Partial<StructureAttributeOptions>
  ) {
    super(structure.fracture);

    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     **************************************************************************/

    const defaultOptions: Partial<StructureAttributeOptions> = {
      ...JSON.parse(JSON.stringify(resourceAttribute.options)),
      structureAttributeType: STRUCTURE_ATTRIBUTE_TYPE.PUBLIC,
    };

    /***************************************************************************
     *
     * INIT OPERATION
     *
     **************************************************************************/
    // all other options
    this.options = deepMerge([
      defaultOptions,
      JSON.parse(JSON.stringify(options)),
    ]) as Required<StructureAttributeOptions>;

    // member components
    this.compositionSources = resourceAttribute.compositionSources.map(
      (sourceAttribute) => {
        return new StructureAttribute(structure, sourceAttribute, options);
      }
    );

    // parents + inverse
    this.structure = structure;
  }

  public get name(): string {
    return this.options.name;
  }

  public get shortName(): string {
    return this.options.shortName;
  }

  /**
   * Boost composed attributes to the end of the list. Doing this
   * ensures helpsmake sure that we have all the other attributes we need prior
   * to building them.
   *
   */
  public get sortPosition(): number {
    const compositionBoost = this.isComposed ? 1000 : 0;
    return this.options.sortPosition + compositionBoost;
  }

  public get isComposed(): boolean {
    return this.generator === ResourceAttributeGenerator.COMPOSITION;
  }

  public get isRequired() {
    // if the required optioun is set, require it here too
    if (this.options.isRequired) {
      return true;
    }

    // otherwise, false
    return false;
  }

  public get generator(): ValueOf<typeof ResourceAttributeGenerator> {
    return this.options.generator;
  }

  public get isGenerated() {
    return this.generator !== ResourceAttributeGenerator.NONE;
  }

  public get service(): Service {
    return this.resource.service;
  }

  public get resource(): Resource {
    return this.structure.resource;
  }
}
