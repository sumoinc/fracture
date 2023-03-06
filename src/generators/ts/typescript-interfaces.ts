import { join } from "path";
import { ValueOf } from "type-fest";
import { TypeScriptSource } from "./typescript-source";
import {
  formatStringByNamingStrategy,
  NAMING_STRATEGY_TYPE,
} from "../../core/naming-strategy";
import { OPERATION_SUB_TYPE } from "../../core/operation";
import { Resource } from "../../core/resource";
import {
  ResourceAttribute,
  ResourceAttributeOptions,
} from "../../core/resource-attribute";

export class TypeScriptInterfaces extends TypeScriptSource {
  public readonly resource: Resource;
  public readonly resourceNameStrategy: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  public readonly attributeNameStrategy: ValueOf<typeof NAMING_STRATEGY_TYPE>;

  constructor(resource: Resource) {
    super(
      resource.service,
      join(resource.service.outdir, `ts/${resource.name}.ts`)
    );
    this.resource = resource;
    this.resourceNameStrategy =
      this.resource.fracture.namingStrategy.model.interfaceName;
    this.attributeNameStrategy =
      this.resource.fracture.namingStrategy.model.attributeName;
  }

  preSynthesize() {
    /**
     * Constructs the comment block above each attribute in the resource
     * @param attribute
     */
    const buildAttributeComment = (attribute: ResourceAttribute) => {
      this.line(`/**`);
      attribute.comment.forEach((c) => this.line(` * ${c}`));
      this.line(` */`);
    };

    const buildInterfaceComment = (resource: Resource) => {
      this.line(`/**`);
      resource.comment.forEach((c) => this.line(` * ${c}`));
      this.line(` */`);
    };

    /**
     * Constructs the attribute
     * @param attribute
     * @param options
     */
    const buildAttribute = (
      attribute: ResourceAttribute,
      options: Partial<ResourceAttributeOptions> = {}
    ) => {
      buildAttributeComment(attribute);

      const attributeName = formatStringByNamingStrategy(
        attribute.name,
        this.attributeNameStrategy
      );

      // required?
      const isRequired = options.isRequired || attribute.isRequired ? "" : "?";
      this.line(`${attributeName}${isRequired}: ${attribute.typeScriptType};`);
    };

    /**
     * Constructs a shortname attribute
     * @param attribute
     * @param options
     */
    const buildShortAttribute = (
      attribute: ResourceAttribute,
      options: Partial<ResourceAttributeOptions> = {}
    ) => {
      buildAttributeComment(attribute);

      const attributeName = formatStringByNamingStrategy(
        attribute.shortName,
        this.attributeNameStrategy
      );

      // required?
      const isRequired = options.isRequired || attribute.isRequired ? "?" : "?";
      this.line(`${attributeName}${isRequired}: ${attribute.typeScriptType};`);
    };

    /**
     * Build this resource's interface.
     */
    buildInterfaceComment(this.resource);
    this.open(`export interface ${this.resource.interfaceName} {`);
    this.resource.attributes.forEach((attribute) => {
      buildAttribute(attribute);
    });
    this.close(`}`);
    this.line("\n");

    this.open(`export interface ${this.resource.interfaceNameDynamo} {`);
    this.resource.attributes.forEach((attribute) => {
      buildShortAttribute(attribute);
    });
    this.line(`${this.resource.service.dynamodb.keyGsi.pkName}?: string;`);
    this.line(`${this.resource.service.dynamodb.keyGsi.skName}?: string;`);
    this.close(`}`);
    this.line("\n");

    /**
     * Operation Interfaces
     */
    this.resource.operations.forEach((operation) => {
      const { inputStructure, outputStructure } = operation;

      // input structure
      const operationInputName = formatStringByNamingStrategy(
        inputStructure.name,
        this.resourceNameStrategy
      );

      //buildInterfaceComment(operation);
      this.open(`export interface ${operationInputName} {`);
      inputStructure.attributes.forEach((structureAttribute) => {
        buildAttribute(structureAttribute.resourceAttribute);
      });
      this.close(`}`);
      this.line(`\n`);
      // output structure
      const operationOutputName = formatStringByNamingStrategy(
        outputStructure.name,
        this.resourceNameStrategy
      );

      // for readone, the output is just the resource entity
      if (operation.operationSubType === OPERATION_SUB_TYPE.READ_ONE) {
        this.line(
          `export interface ${operationOutputName} extends ${this.resource.interfaceName} {}`
        );
        this.line(`\n`);
        return;
      }

      this.open(`export interface ${operationOutputName} {`);
      outputStructure.attributes.forEach((structureAttribute) => {
        buildAttribute(structureAttribute.resourceAttribute);
      });
      this.close(`}`);
      this.line(`\n`);
    });

    super.preSynthesize();
  }
}
