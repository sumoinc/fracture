import { TypescriptResource } from "./typescript-resource";
import { FractureComponent } from "../../core";
import { formatStringByNamingStrategy } from "../../core/naming-strategy";
import { Resource } from "../../core/resource";
import {
  ResourceAttribute,
  ResourceAttributeType,
} from "../../core/resource-attribute";
import { Service } from "../../core/service";

export class TypescriptResourceAttribute extends FractureComponent {
  // parent
  public readonly tsResource: TypescriptResource;
  // source
  public readonly resourceAttribute: ResourceAttribute;

  constructor(
    tsResource: TypescriptResource,
    resourceAttribute: ResourceAttribute
  ) {
    super(tsResource.fracture);

    this.tsResource = tsResource;
    this.resourceAttribute = resourceAttribute;
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

  public get comments() {
    return [`/**`]
      .concat(this.resourceAttribute.comments.map((c) => ` * ${c}`))
      .concat([` */`]);
  }

  public get required() {
    return "?";
    //return this.resourceAttribute.isRequired ? "" : "";
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

  public get resource(): Resource {
    return this.tsResource.resource;
  }

  public get service(): Service {
    return this.resource.service;
  }
}
