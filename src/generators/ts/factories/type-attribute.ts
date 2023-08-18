import { SyntaxKind, addSyntheticLeadingComment, factory } from "typescript";
import { TypescriptFactory } from "./typescript-factory";
import { FractureService } from "../../../core";
import { StructureAttribute } from "../../../core/structure-attribute";
import { TypescriptStrategy } from "../strategy";

export class TypeAttributeFactory extends TypescriptFactory {
  /**
   * Turns and array of StructureAttributes into Typescript properties.
   */
  public static toTypeProperies({
    service,
    attributes,
  }: {
    service: FractureService;
    attributes: StructureAttribute[];
  }) {
    return factory.createTypeLiteralNode(
      attributes.map((attribute) => {
        return TypeAttributeFactory.toTypeProperty({
          service,
          attribute,
        });
      })
    );
  }

  /**
   * Turns one StructureAttribute into a Typescript property.
   */
  public static toTypeProperty({
    service,
    attribute,
  }: {
    service: FractureService;
    attribute: StructureAttribute;
  }) {
    const strategy = TypescriptStrategy.of(service);

    if (!strategy) {
      throw new Error(`No TypescriptStrategy defined at the service level.`);
    }

    // is this attribute required?
    const required = !attribute.required
      ? factory.createToken(SyntaxKind.QuestionToken)
      : undefined;

    // define the property
    const prop = factory.createPropertySignature(
      undefined,
      factory.createIdentifier(strategy.formatAttributeName(attribute.name)),
      required,
      factory.createKeywordTypeNode(SyntaxKind.StringKeyword)
    );

    // add comments if needed
    if (attribute.comments.length) {
      addSyntheticLeadingComment(
        prop,
        SyntaxKind.MultiLineCommentTrivia,
        `*\n * ${attribute.comments.join("\n * ")}\n`,
        true
      );
    }

    return prop;
  }
}
