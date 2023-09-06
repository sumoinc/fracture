import { paramCase } from "change-case";
import { Component } from "projen";
import { NodeProject } from "projen/lib/javascript/node-project.js";
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
  public static all(project: NodeProject): Structure[] {
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

    // //
    // if (
    //   (this.type === StructureType.INPUT ||
    //     this.type === StructureType.OUTPUT) &&
    //   !this.operation
    // ) {
    //   throw new Error(
    //     `Operation option is required for Input and Output Structires`
    //   );
    // }

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

  /**
   * Structure name, based on the naming strategy
   */
  /*
  public get name() {
    const resourceName = this.operation
      ? this.operation.name
      : this.resource.name;
    const prefix = this.namingStrategy.structures.prefixes[this.type];
    const suffix = this.namingStrategy.structures.suffixes[this.type];

    return [prefix, resourceName, suffix]
      .filter((part) => part.length > 0)
      .join("-");
  }
  */

  // public getResourceAttributeByName(name: string) {
  //   return this.attributes.find((a) => a.name === name);
  // }

  // private sortAttributes(
  //   resourceAttributes: ResourceAttribute[]
  // ): ResourceAttribute[] {
  //   return resourceAttributes.sort((a, b) => {
  //     if (a.sortPosition < b.sortPosition) {
  //       return -1;
  //     } else if (a.sortPosition > b.sortPosition) {
  //       return 1;
  //     } else {
  //       return 0;
  //     }
  //   });
  // }

  // /**
  //  * Includes all public attributes, plus generated attributes and GSI
  //  * attributes. This is a good list to use for dynamodb operations.
  //  */
  // public get attributes(): ResourceAttribute[] {
  //   return this.sortAttributes(this.resource.attributes);
  // }

  // /**
  //  * Attributes that should be exposed to the public. Inputs, outputs, etc
  //  */
  // public get publicAttributes(): ResourceAttribute[] {
  //   switch (this.type) {
  //     case StructureType.DATA:
  //       return this.attributes.filter((a: ResourceAttribute) => {
  //         return !a.isAccessPatternKey;
  //       });

  //     // INPUTS
  //     case StructureType.INPUT:
  //       switch (this.operation!.operationSubType) {
  //         case OPERATION_SUB_TYPE.CREATE_ONE:
  //           return this.attributes.filter((a: ResourceAttribute) => {
  //             return a.isData;
  //           });

  //         case OPERATION_SUB_TYPE.READ_ONE:
  //         case OPERATION_SUB_TYPE.DELETE_ONE:
  //           return this.keyAttributeSources.filter((a) => {
  //             return !a.isGeneratedOn(this.operation);
  //           });

  //         case OPERATION_SUB_TYPE.UPDATE_ONE:
  //           return this.attributes.filter((a: ResourceAttribute) => {
  //             return (
  //               !a.isSystem && (a.isData || !a.isGeneratedOn(this.operation))
  //             );
  //           });

  //         case OPERATION_SUB_TYPE.LIST:
  //           return [this.resource.lookupAccessPattern.skAttribute];

  //         default:
  //           return [];
  //       }

  //     case StructureType.OUTPUT:
  //       return this.attributes.filter((a: ResourceAttribute) => {
  //         return !a.isAccessPatternKey && a.isOutputOn(this.operation);
  //       });

  //     case StructureType.TRANSIENT:
  //       return this.attributes.filter((a: ResourceAttribute) => {
  //         return !a.isAccessPatternKey;
  //       });
  //   }
  // }

  // public get itemAttributes(): ResourceAttribute[] {
  //   // only applies to inputs
  //   if (this.type !== StructureType.INPUT) {
  //     return [];
  //   }
  //   // on create, put in everything
  //   if (this.operation?.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE) {
  //     return this.sortAttributes(
  //       this.publicAttributes.concat(this.generatedAttributes)
  //     );
  //   }

  //   // on read we need all the parts of the pk and sk that are not generated on read
  //   if (this.operation?.operationSubType === OPERATION_SUB_TYPE.READ_ONE) {
  //     return this.keyAttributeSources.filter((a) => !a.isGenerated);
  //   }

  //   if (this.operation?.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE) {
  //     return this.sortAttributes(
  //       this.publicAttributes.concat(this.generatedAttributes).filter((a) => {
  //         return !a.isKeyPart;
  //       })
  //     );
  //   }

  //   return [];
  // }

  // public get keyAttributes(): ResourceAttribute[] {
  //   // only applies to inputs
  //   if (this.type === StructureType.INPUT) {
  //     return this.attributes.filter((a) => a.isPartitionKey || a.isSortKey);
  //   }
  //   return [];
  // }

  // public get keyAttributeSources(): ResourceAttribute[] {
  //   let returnAttributes = [] as ResourceAttribute[];
  //   this.keyAttributes.forEach((keyAttribute) => {
  //     keyAttribute.compositionSources.forEach((sourceAttribute) => {
  //       returnAttributes.push(sourceAttribute as ResourceAttribute);
  //     });
  //   });
  //   return returnAttributes;
  // }

  // public get generatedAttributes(): ResourceAttribute[] {
  //   // only applies to inputs
  //   if (this.type === StructureType.INPUT) {
  //     return this.attributes.filter((a) => a.isGeneratedOn(this.operation));
  //   }
  //   return [];
  // }

  // public hasGenerator(
  //   generator: ValueOf<typeof ResourceAttributeGenerator>
  // ): boolean {
  //   // generator only apply to operations
  //   if (!this.operation) {
  //     return false;
  //   }
  //   return this.attributes.some(
  //     (a) => a.isGeneratedOn(this.operation) && a.generator === generator
  //   );
  // }

  // public get attributeNames() {
  //   return this.attributes.map((attribute) => attribute.name);
  // }

  // public get service(): Service {
  //   return this.resource.service;
  // }

  // public get namingStrategy() {
  //   return this.service.namingStrategy;
  // }

  // public get auditStrategy() {
  //   return this.service.auditStrategy;
  // }
  // /*****************************************************************************
  //  *
  //  *  TYPESCRIPT HELPERS
  //  *
  //  ****************************************************************************/

  // public get tsInterfaceName() {
  //   return formatStringByNamingStrategy(
  //     this.name,
  //     this.resource.namingStrategy.ts.interfaceName
  //   );
  // }
}
