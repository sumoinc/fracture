import { deepMerge } from "projen/lib/util";
import { ValueOf } from "type-fest";
import { FractureComponent } from "./component";
import { Operation, OPERATION_SUB_TYPE } from "./operation";
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

export type StructureAttributeOptions = {
  /**
   * What resource attribute is this structure attribute based on?
   */
  resourceAttribute: ResourceAttribute;
  /**
   * Replacement / override options for structure attribute
   */
  structureAttributeOptions?: Partial<ResourceAttributeOptions>;
  /**
   * Is this a public or private attribute?
   */
  structureAttributeType: ValueOf<typeof STRUCTURE_ATTRIBUTE_TYPE>;
};

/******************************************************************************
 * CLASS
 *****************************************************************************/

export class StructureAttribute extends FractureComponent {
  // member components
  public readonly compositionSources: StructureAttribute[];
  public readonly structureAttributeType: ValueOf<
    typeof STRUCTURE_ATTRIBUTE_TYPE
  >;
  // parent
  public readonly structure: Structure;

  // all other options
  public readonly options: Required<ResourceAttributeOptions>;

  constructor(structure: Structure, options: StructureAttributeOptions) {
    super(structure.fracture);

    /***************************************************************************
     *
     * INIT OPERATION
     *
     **************************************************************************/

    // member components
    this.compositionSources = options.resourceAttribute.compositionSources.map(
      (source) => {
        return new StructureAttribute(structure, {
          resourceAttribute: source,
          structureAttributeType: options.structureAttributeType,
        });
      }
    );
    this.structureAttributeType = options.structureAttributeType;

    // parents + inverse
    this.structure = structure;

    // all other options
    this.options = deepMerge([
      JSON.parse(JSON.stringify(options.resourceAttribute.options)),
      options.structureAttributeOptions ?? {},
    ]) as Required<ResourceAttributeOptions>;
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
    return this.hasGenerator(ResourceAttributeGenerator.COMPOSITION);
  }

  public get isRequired() {
    // if the required optioun is set, require it here too
    if (this.options.isRequired) {
      return true;
    }

    // otherwise, false
    return false;
  }

  /**
   *
   * @param generator Does this attribute have a generator for this specific type?
   * @returns
   */
  public hasGenerator(
    generator: ValueOf<typeof ResourceAttributeGenerator>
  ): boolean {
    return (
      this.isGenerated &&
      (this.hasCreateGenerator(generator) ||
        this.hasReadGenerator(generator) ||
        this.hasUpdateGenerator(generator) ||
        this.hasDeleteGenerator(generator) ||
        this.hasImportGenerator(generator))
    );
  }

  // generated fields
  public get isGenerated(): boolean {
    return (
      this.isCreateGenerated ||
      this.isReadGenerated ||
      this.isUpdateGenerated ||
      this.isDeleteGenerated ||
      this.isImportGenerated
    );
  }
  public get isCreateGenerated(): boolean {
    return this.options.createGenerator !== ResourceAttributeGenerator.NONE;
  }
  public get isReadGenerated(): boolean {
    return this.options.readGenerator !== ResourceAttributeGenerator.NONE;
  }
  public get isUpdateGenerated(): boolean {
    return this.options.updateGenerator !== ResourceAttributeGenerator.NONE;
  }
  public get isDeleteGenerated(): boolean {
    return this.options.deleteGenerator !== ResourceAttributeGenerator.NONE;
  }
  public get isImportGenerated(): boolean {
    return this.options.importGenerator !== ResourceAttributeGenerator.NONE;
  }

  public hasCreateGenerator(
    generator: ValueOf<typeof ResourceAttributeGenerator>
  ): boolean {
    return this.isCreateGenerated && this.options.createGenerator === generator;
  }
  public hasReadGenerator(
    generator: ValueOf<typeof ResourceAttributeGenerator>
  ): boolean {
    return this.isReadGenerated && this.options.readGenerator === generator;
  }
  public hasUpdateGenerator(
    generator: ValueOf<typeof ResourceAttributeGenerator>
  ): boolean {
    return this.isUpdateGenerated && this.options.updateGenerator === generator;
  }
  public hasDeleteGenerator(
    generator: ValueOf<typeof ResourceAttributeGenerator>
  ): boolean {
    return this.isDeleteGenerated && this.options.deleteGenerator === generator;
  }
  public hasImportGenerator(
    generator: ValueOf<typeof ResourceAttributeGenerator>
  ): boolean {
    return this.isImportGenerated && this.options.importGenerator === generator;
  }

  public generatorForOperation(operation: Operation) {
    switch (operation.options.operationSubType) {
      case OPERATION_SUB_TYPE.CREATE_ONE:
        return this.options.createGenerator;
      case OPERATION_SUB_TYPE.READ_ONE:
        return this.options.readGenerator;
      case OPERATION_SUB_TYPE.UPDATE_ONE:
        return this.options.updateGenerator;
      case OPERATION_SUB_TYPE.DELETE_ONE:
        return this.options.deleteGenerator;
      case OPERATION_SUB_TYPE.IMPORT_ONE:
        return this.options.importGenerator;
      default:
        throw new Error(`Unknown sub-operation: ${operation}`);
    }
  }

  public get service(): Service {
    return this.resource.service;
  }

  public get resource(): Resource {
    return this.structure.resource;
  }
}
