import { TypescriptStructure } from "./typescript-structure";
import { FractureComponent } from "../../core";
import { formatStringByNamingStrategy } from "../../core/naming-strategy";
import { Operation } from "../../core/operation";
import { Resource } from "../../core/resource";
import {
  ResourceAttributeGenerator,
  ResourceAttributeType,
} from "../../core/resource-attribute";
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
      case ResourceAttributeGenerator.NONE:
        throw new Error("No generator! Did you call isGenerated first?");
      case ResourceAttributeGenerator.GUID:
        return "uuidv4()";
      case ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP:
        return "new Date().toISOString()";
      case ResourceAttributeGenerator.TYPE:
        return `"${this.resource.name}"`;
      case ResourceAttributeGenerator.VERSION:
        return `"${this.service.options.versionStrategy.currentVersion}"`;
      case ResourceAttributeGenerator.COMPOSITION:
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
      case ResourceAttributeType.GUID:
      case ResourceAttributeType.STRING:
      case ResourceAttributeType.EMAIL:
      case ResourceAttributeType.PHONE:
      case ResourceAttributeType.URL:
      case ResourceAttributeType.DATE:
      case ResourceAttributeType.TIME:
      case ResourceAttributeType.DATE_TIME:
      case ResourceAttributeType.JSON:
      case ResourceAttributeType.IPADDRESS:
        return "string";
      case ResourceAttributeType.INT:
      case ResourceAttributeType.FLOAT:
      case ResourceAttributeType.TIMESTAMP:
      case ResourceAttributeType.COUNT:
      case ResourceAttributeType.AVERAGE:
      case ResourceAttributeType.SUM:
        return "number";
      case ResourceAttributeType.BOOLEAN:
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
