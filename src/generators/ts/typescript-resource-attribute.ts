import { FractureComponent } from "../../core";
import { formatStringByNamingStrategy } from "../../core/naming-strategy";
import {
  ResourceAttribute,
  ResourceAttributeType,
} from "../../core/resource-attribute";

export class TypescriptResourceAttribute extends FractureComponent {
  public readonly resourceAttribute: ResourceAttribute;

  constructor(resourceAttribute: ResourceAttribute) {
    super(resourceAttribute.fracture);

    this.resourceAttribute = resourceAttribute;
  }

  /**
   * Gets formatted attribute name for this resource
   */
  public get attributeName() {
    return formatStringByNamingStrategy(
      this.resourceAttribute.name,
      this.fracture.namingStrategy.ts.attributeName
    );
  }

  public get comment() {
    return [`/**`]
      .concat(this.resourceAttribute.comment.map((c) => ` * ${c}`))
      .concat([` */`]);
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
}
