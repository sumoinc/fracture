import { deepMerge } from "projen/lib/util";
import { SetRequired, ValueOf } from "type-fest";
import { FractureComponent } from "./component";
import { Operation, OPERATION_SUB_TYPE } from "./operation";
import { Resource } from "./resource";
import {
  ResourceAttribute,
  ResourceAttributeGenerator,
} from "./resource-attribute";
import { Service } from "./service";
import { TypescriptStructure } from "../generators/ts/typescript-structure";

/******************************************************************************
 * TYPES
 *****************************************************************************/

export type StructureOptions = {
  /**
   *  Type of structure
   */
  type?: ValueOf<typeof STRUCTURE_TYPE>;
  /**
   * Required if type is input or output
   */
  operation?: Operation;
  /**
   * Comment lines to add to the Structure.
   * @default []
   */
  comments?: string[];
};

export const STRUCTURE_TYPE = {
  INPUT: "Input",
  OUTPUT: "Output",
  /**
   * Represents the structure of persistant data
   */
  DATA: "Data",
  /**
   * Represents the structure of transient data such as messages or events
   */
  TRANSIENT: "Transient",
} as const;

/******************************************************************************
 * CLASS
 *****************************************************************************/

export class Structure extends FractureComponent {
  // member components
  // parent
  public readonly resource: Resource;
  // all other options
  public readonly options: SetRequired<StructureOptions, "type" | "comments">;
  // generators
  public readonly ts: TypescriptStructure;

  constructor(resource: Resource, options: StructureOptions) {
    super(resource.fracture);

    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     **************************************************************************/

    const defaultOptions: Partial<StructureOptions> = {
      type: STRUCTURE_TYPE.DATA,
      comments: ["A gereric type"],
    };

    /***************************************************************************
     *
     * INIT OPERATION
     *
     **************************************************************************/

    // member components

    // parents + inverse
    this.resource = resource;
    this.resource.structures.push(this);

    // all other options
    this.options = deepMerge([defaultOptions, options]) as SetRequired<
      StructureOptions,
      "type" | "comments"
    >;

    this.project.logger.info(`INIT Structure: "${this.name}"`);

    //
    if (
      (this.type === STRUCTURE_TYPE.INPUT ||
        this.type === STRUCTURE_TYPE.OUTPUT) &&
      !this.operation
    ) {
      throw new Error(
        `Operation option is required for Input and Output Structires`
      );
    }

    /***************************************************************************
     *
     * GENERATORS
     *
     **************************************************************************/

    this.ts = new TypescriptStructure(this);

    return this;
  }

  // build structures
  public build() {
    this.project.logger.info(`BUILD Structure: "${this.name}"`);
    // build generators
    this.ts.build();
  }

  /**
   * Structure name, based on the naming strategy
   */
  public get name() {
    const resourceName = this.operation
      ? this.operation.name
      : this.resource.name;
    const prefix = this.namingStrategy.structures.prefixes[this.type];
    const suffix = this.fracture.namingStrategy.structures.suffixes[this.type];

    return [prefix, resourceName, suffix]
      .filter((part) => part.length > 0)
      .join("-");
  }

  public get type() {
    return this.options.type;
  }

  public get operation(): Operation | undefined {
    return this.options.operation;
  }

  public get comments(): string[] {
    return this.options.comments;
  }

  public getResourceAttributeByName(name: string) {
    return this.attributes.find((a) => a.name === name);
  }

  private sortAttributes(
    resourceAttributes: ResourceAttribute[]
  ): ResourceAttribute[] {
    return resourceAttributes.sort((a, b) => {
      if (a.sortPosition < b.sortPosition) {
        return -1;
      } else if (a.sortPosition > b.sortPosition) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  /**
   * Includes all public attributes, plus generated attributes and GSI
   * attributes. This is a good list to use for dynamodb operations.
   */
  public get attributes(): ResourceAttribute[] {
    return this.sortAttributes(this.resource.attributes);
  }

  /**
   * Attributes that should be exposed to the public. Inputs, outputs, etc
   */
  public get publicAttributes(): ResourceAttribute[] {
    switch (this.type) {
      case STRUCTURE_TYPE.DATA:
        return this.attributes.filter((a: ResourceAttribute) => {
          return !a.isAccessPatternKey;
        });

      // INPUTS
      case STRUCTURE_TYPE.INPUT:
        switch (this.operation!.operationSubType) {
          case OPERATION_SUB_TYPE.CREATE_ONE:
            return this.attributes.filter((a: ResourceAttribute) => {
              return a.isData;
            });

          case OPERATION_SUB_TYPE.READ_ONE:
          case OPERATION_SUB_TYPE.DELETE_ONE:
            return this.keyAttributeSources.filter((a) => {
              return !a.isGeneratedOn(this.operation);
            });

          case OPERATION_SUB_TYPE.UPDATE_ONE:
            return this.attributes.filter((a: ResourceAttribute) => {
              return (
                !a.isSystem && (a.isData || !a.isGeneratedOn(this.operation))
              );
            });

          case OPERATION_SUB_TYPE.LIST:
            return [this.resource.lookupAccessPattern.skAttribute];

          default:
            return [];
        }

      case STRUCTURE_TYPE.OUTPUT:
        return this.attributes.filter((a: ResourceAttribute) => {
          return !a.isAccessPatternKey && a.isOutputOn(this.operation);
        });

      case STRUCTURE_TYPE.TRANSIENT:
        return this.attributes.filter((a: ResourceAttribute) => {
          return !a.isAccessPatternKey;
        });
    }
  }

  public get itemAttributes(): ResourceAttribute[] {
    // only applies to inputs
    if (this.type !== STRUCTURE_TYPE.INPUT) {
      return [];
    }
    // on create, put in everything
    if (this.operation?.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE) {
      return this.sortAttributes(
        this.publicAttributes.concat(this.generatedAttributes)
      );
    }

    // on read we need all the parts of the pk and sk that are not generated on read
    if (this.operation?.operationSubType === OPERATION_SUB_TYPE.READ_ONE) {
      return this.keyAttributeSources.filter((a) => !a.isGenerated);
    }

    if (this.operation?.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE) {
      return this.sortAttributes(
        this.publicAttributes.concat(this.generatedAttributes).filter((a) => {
          return !a.isKeyPart;
        })
      );
    }

    return [];
  }

  public get keyAttributes(): ResourceAttribute[] {
    // only applies to inputs
    if (this.type === STRUCTURE_TYPE.INPUT) {
      return this.attributes.filter((a) => a.isPartitionKey || a.isSortKey);
    }
    return [];
  }

  public get keyAttributeSources(): ResourceAttribute[] {
    let returnAttributes = [] as ResourceAttribute[];
    this.keyAttributes.forEach((keyAttribute) => {
      keyAttribute.compositionSources.forEach((sourceAttribute) => {
        returnAttributes.push(sourceAttribute as ResourceAttribute);
      });
    });
    return returnAttributes;
  }

  public get generatedAttributes(): ResourceAttribute[] {
    // only applies to inputs
    if (this.type === STRUCTURE_TYPE.INPUT) {
      return this.attributes.filter((a) => a.isGeneratedOn(this.operation));
    }
    return [];
  }

  public hasGenerator(
    generator: ValueOf<typeof ResourceAttributeGenerator>
  ): boolean {
    // generator only apply to operations
    if (!this.operation) {
      return false;
    }
    return this.attributes.some(
      (a) => a.isGeneratedOn(this.operation) && a.generator === generator
    );
  }

  public get attributeNames() {
    return this.attributes.map((attribute) => attribute.name);
  }

  public get service(): Service {
    return this.resource.service;
  }

  public get namingStrategy() {
    return this.service.namingStrategy;
  }

  public get auditStrategy() {
    return this.service.auditStrategy;
  }
}