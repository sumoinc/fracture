import { deepMerge } from "projen/lib/util";
import { SetRequired, ValueOf } from "type-fest";
import { FractureComponent } from "./component";
import { Operation, OPERATION_SUB_TYPE } from "./operation";
import { Resource } from "./resource";
import { ResourceAttribute } from "./resource-attribute";
import { Service } from "./service";

/******************************************************************************
 * TYPES
 *****************************************************************************/

export type StructureAttribute = {
  attribute: ResourceAttribute;
  isRequired: boolean;
};

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

    //
    if (
      (this.options.type === STRUCTURE_TYPE.INPUT ||
        this.options.type === STRUCTURE_TYPE.OUTPUT) &&
      !this.options.operation
    ) {
      throw new Error(
        `Operation option is required for Input and Output Structires`
      );
    }
  }

  // calling this  forces gneration of attributes
  public build() {}

  /**
   * Structure name, based on the naming strategy
   */
  public get name() {
    const resourceName = this.options.operation
      ? this.options.operation.name
      : this.resource.name;
    const prefix =
      this.fracture.options.namingStrategy.structures.prefixes[
        this.options.type
      ];
    const suffix =
      this.fracture.options.namingStrategy.structures.suffixes[
        this.options.type
      ];

    return [prefix, resourceName, suffix]
      .filter((part) => part.length > 0)
      .join("-");
  }

  public get type() {
    return this.options.type;
  }

  public getResourceAttributeByName(name: string) {
    return this.attributes.find((a) => a.name === name);
  }

  /**
   * Includes all public attributes, plus generated attributes and GSI
   * attributes. This is a good list to use for dynamodb operations.
   */
  public get attributes() {
    return this.resource.attributes;
  }

  /**
   * Attributes that should be exposed to the public. Inputs, outputs, etc
   */
  public get publicAttributes(): ResourceAttribute[] {
    switch (this.type) {
      case STRUCTURE_TYPE.DATA:
        return this.attributes.filter((attribute: ResourceAttribute) => {
          return !attribute.isAccessPatternKey;
        });

      // INPUTS
      case STRUCTURE_TYPE.INPUT:
        switch (this.operation!.operationSubType) {
          case OPERATION_SUB_TYPE.CREATE_ONE:
            return this.attributes.filter((attribute: ResourceAttribute) => {
              return attribute.isData;
            });
          case OPERATION_SUB_TYPE.READ_ONE:
            console.log(
              this.operation!.operationSubType,
              this.keyAttributeSources
            );
            return this.keyAttributeSources.filter((a) => {
              console.log(a.name, a.isGenerated);
              return !a.isGenerated;
            });

          default:
            return [];
        }

      case STRUCTURE_TYPE.OUTPUT:
        return this.attributes.filter((attribute: ResourceAttribute) => {
          return !attribute.isAccessPatternKey;
        });
      case STRUCTURE_TYPE.TRANSIENT:
        return this.attributes.filter((attribute: ResourceAttribute) => {
          return !attribute.isAccessPatternKey;
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
      return this.attributes;
    }

    // on read we need all the parts of the pk and sk that are not generated on read
    if (this.operation?.operationSubType === OPERATION_SUB_TYPE.READ_ONE) {
      return this.keyAttributeSources.filter((a) => !a.isGenerated);
    }

    return [];
  }

  public get keyAttributes(): ResourceAttribute[] {
    // only applies to inputs
    if (this.type !== STRUCTURE_TYPE.INPUT) {
      return [];
    }
    return this.attributes.filter((a) => a.isPartitionKey || a.isSortKey);
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
    if (this.type !== STRUCTURE_TYPE.INPUT) {
      return [];
    }
    return this.attributes.filter((a) => a.isGenerated);
  }

  public get attributeNames() {
    return this.attributes.map((attribute) => attribute.name);
  }

  public get operation(): Operation | undefined {
    return this.options.operation;
  }

  public get service(): Service {
    return this.resource.service;
  }
}
