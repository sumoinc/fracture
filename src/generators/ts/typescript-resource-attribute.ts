import { FractureComponent } from "../../core";
import { formatStringByNamingStrategy } from "../../core/naming-strategy";
import { Operation } from "../../core/operation";
import { Resource } from "../../core/resource";
import {
  ResourceAttribute,
  ResourceAttributeGenerator,
  ResourceAttributeType,
} from "../../core/resource-attribute";
import { Service } from "../../core/service";

export class TypescriptResourceAttribute extends FractureComponent {
  // parent
  //public readonly tsResource: TypescriptResource;
  // source
  public readonly resourceAttribute: ResourceAttribute;

  constructor(resourceAttribute: ResourceAttribute) {
    super(resourceAttribute.fracture);

    //this.tsResource = tsResource;
    this.resourceAttribute = resourceAttribute;

    this.project.logger.debug(
      `TS:INIT Attribute: "${this.resourceAttribute.name}"`
    );
  }

  /**
   * Gets formatted attribute name for this resource
   */
  public get attributeName() {
    return formatStringByNamingStrategy(
      this.resourceAttribute.name,
      this.service.namingStrategy.ts.attributeName
    );
  }

  public get attributeShortName() {
    return formatStringByNamingStrategy(
      this.resourceAttribute.shortName,
      this.service.namingStrategy.ts.attributeName
    );
  }

  public get required() {
    return this.resourceAttribute.isRequired ? "" : "?";
  }

  /**
   * The typescript type for this attribute.
   */
  public get type() {
    switch (this.resourceAttribute.type) {
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
          `Unknown attribute type: ${this.resourceAttribute.type}`
        );
    }
  }

  public generationSource(operation: Operation) {
    const generator = this.resourceAttribute.generator;
    switch (generator) {
      case ResourceAttributeGenerator.NONE:
        throw new Error("No generator! Did you call isGenerated first?");
      case ResourceAttributeGenerator.GUID:
        return "uuidv4()";
      case ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP:
        return "new Date().toISOString()";
      case ResourceAttributeGenerator.TYPE:
        return `"${this.resource.name}"`;
      case ResourceAttributeGenerator.VERSION_DATE_TIME_STAMP:
        if (this.resourceAttribute.hasDefaultFor(operation)) {
          return `"${this.resourceAttribute.defaultFor(operation)}"`;
        } else {
          return "new Date().toISOString()";
        }
      case ResourceAttributeGenerator.COMPOSITION:
        return this.resourceAttribute.compositionSources.length === 0
          ? undefined
          : this.resourceAttribute.compositionSources
              .map((s) => {
                return `${s.shortName}.toLowerCase()`;
              })
              .join(
                ` + "${this.resourceAttribute.options.compositionSeperator}" + `
              );
      default:
        throw new Error(`Unknown generator: ${generator}`);
    }
  }

  public get resource(): Resource {
    return this.resourceAttribute.resource;
  }

  public get service(): Service {
    return this.resource.service;
  }
}
