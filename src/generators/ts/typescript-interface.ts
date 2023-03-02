import { ValueOf } from "type-fest";
import { TypeScriptSource } from "./typescript-source";
import {
  formatStringByNamingStrategy,
  NAMING_STRATEGY_TYPE,
} from "../../core/naming-strategy";
import { Resource } from "../../core/resource";
import {
  ResourceAttribute,
  ResourceAttributeOptions,
} from "../../core/resource-attribute";

export class TypeScriptInterface extends TypeScriptSource {
  public readonly shape: Resource;
  public readonly shapeNameStrategy: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  public readonly attributeNameStrategy: ValueOf<typeof NAMING_STRATEGY_TYPE>;

  constructor(shape: Resource) {
    super(shape.service, `ts/${shape.name}.ts`);
    this.shape = shape;
    this.shapeNameStrategy = this.shape.fracture.namingStrategy.model.shapeName;
    this.attributeNameStrategy =
      this.shape.fracture.namingStrategy.model.attributeName;
  }

  public get interfaceName() {
    return formatStringByNamingStrategy(
      this.shape.name,
      this.shapeNameStrategy
    );
  }

  preSynthesize() {
    /**
     * Constructs the comment block above each attribute in the shape
     * @param attribute
     */
    const buildAttributeComment = (attribute: ResourceAttribute) => {
      this.line(`/**`);
      attribute.comment.forEach((c) => this.line(` * ${c}`));
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
     * Build this shape's interface.
     */
    this.open(`export interface ${this.interfaceName} {`);
    this.shape.attributes.forEach((attribute) => {
      buildAttribute(attribute);
    });
    this.close(`}`);
    this.line("\n");

    super.preSynthesize();
  }
}
