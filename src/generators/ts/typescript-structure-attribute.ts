import { TypescriptStructure } from "./typescript-structure";
import { FractureComponent } from "../../core";
import { AttributeGenerator, AttributeType } from "../../core/attribute";
import { formatStringByNamingStrategy } from "../../core/naming-strategy";
import { Operation } from "../../core/operation";
import { Resource } from "../../core/resource";
import { Service } from "../../core/service";
import { Structure } from "../../core/structure";
import { StructureAttribute } from "../../core/structure-attribute";

export class TypescriptStructureAttribute extends FractureComponent {
  public readonly structureAttribute: StructureAttribute;

  public readonly tsStructure: TypescriptStructure;

  constructor(
    tsStructure: TypescriptStructure,
    structureAttribute: StructureAttribute
  ) {
    super(structureAttribute.fracture);

    this.structureAttribute = structureAttribute;
    this.tsStructure = tsStructure;
  }

  public get isRequired() {
    return this.structureAttribute.isRequired;
  }

  public get attributeName() {
    return formatStringByNamingStrategy(
      this.structureAttribute.name,
      this.fracture.options.namingStrategy.ts.attributeName
    );
  }

  public get attributeShortName() {
    return formatStringByNamingStrategy(
      this.structureAttribute.shortName,
      this.fracture.options.namingStrategy.ts.attributeName
    );
  }

  public get attributeSource() {
    if (this.structureAttribute.isGenerated) {
      return this.generatedSource;
    }
    return this.attributeName;
  }

  public get generatedSource() {
    if (!this.operation) {
      throw new Error("Operation is not defined");
    }
    const generator = this.structureAttribute.generator;
    switch (generator) {
      case AttributeGenerator.NONE:
        throw new Error("No generator! Did you call isGenerated first?");
      case AttributeGenerator.GUID:
        return "uuidv4()";
      case AttributeGenerator.CURRENT_DATE_TIME_STAMP:
        return "new Date().toISOString()";
      case AttributeGenerator.TYPE:
        return `"${this.resource.name}"`;
      case AttributeGenerator.VERSION:
        return `"${this.service.options.versionStrategy.currentVersion}"`;
      case AttributeGenerator.COMPOSITION:
        return this.structureAttribute.compositionSources.length === 0
          ? undefined
          : this.structureAttribute.compositionSources
              .map((s) => {
                return `${s.shortName}.toLowerCase()`;
              })
              .join(
                ` + "${this.structureAttribute.options.compositionSeperator}" + `
              );
      default:
        throw new Error(`Unknown generator: ${generator}`);
    }
  }

  public get comments() {
    return [`/**`]
      .concat(this.structureAttribute.options.comments.map((c) => ` * ${c}`))
      .concat([` */`]);
  }

  /**
   * The typescript type for this attribute.
   */
  public get typescriptType() {
    switch (this.structureAttribute.options.type) {
      case AttributeType.GUID:
      case AttributeType.STRING:
      case AttributeType.EMAIL:
      case AttributeType.PHONE:
      case AttributeType.URL:
      case AttributeType.DATE:
      case AttributeType.TIME:
      case AttributeType.DATE_TIME:
      case AttributeType.JSON:
      case AttributeType.IPADDRESS:
        return "string";
      case AttributeType.INT:
      case AttributeType.FLOAT:
      case AttributeType.TIMESTAMP:
      case AttributeType.COUNT:
      case AttributeType.AVERAGE:
      case AttributeType.SUM:
        return "number";
      case AttributeType.BOOLEAN:
        return "boolean";
      default:
        throw new Error(
          `Unknown attribute type: ${this.structureAttribute.options.type}`
        );
    }
  }

  public get structure(): Structure {
    return this.structureAttribute.structure;
  }
  public get resource(): Resource {
    return this.structure.resource;
  }
  public get service(): Service {
    return this.resource.service;
  }
  public get operation(): Operation | undefined {
    return this.structure.operation;
  }
}
