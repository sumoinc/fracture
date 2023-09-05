import { SyntaxKind, addSyntheticLeadingComment, factory } from "typescript";
import { FractureService } from "../../../core";
import {
  StructureAttribute,
  StructureAttributeType,
} from "../../../core/structure-attribute.ts-disabled";
import { TypescriptStrategy } from "../strategy";

/**
 * Turns and array of StructureAttributes into Typescript properties.
 */
export const buildTypeProperies = ({
  service,
  attributes,
}: {
  service: FractureService;
  attributes: StructureAttribute[];
}) => {
  return factory.createTypeLiteralNode(
    attributes.map((attribute) => {
      return buildTypeProperty({
        service,
        attribute,
      });
    })
  );
};

/**
 * Turns one StructureAttribute into a Typescript property.
 */
export const buildTypeProperty = ({
  service,
  attribute,
}: {
  service: FractureService;
  attribute: StructureAttribute;
}) => {
  /***************************************************************************
   * Strategy
   **************************************************************************/

  const strategy = TypescriptStrategy.of(service);

  if (!strategy) {
    throw new Error(`No TypescriptStrategy defined at the service level.`);
  }

  /***************************************************************************
   * Type Closure
   **************************************************************************/

  const buildTypePropertyType = () => {
    const { type, typeParameter } = {
      typeParameter: "any",
      ...attribute,
    };

    switch (type) {
      case StructureAttributeType.GUID:
      case StructureAttributeType.STRING:
      case StructureAttributeType.EMAIL:
      case StructureAttributeType.PHONE:
      case StructureAttributeType.URL:
      case StructureAttributeType.DATE:
      case StructureAttributeType.TIME:
      case StructureAttributeType.DATE_TIME:
      case StructureAttributeType.JSON:
      case StructureAttributeType.IPADDRESS:
        return factory.createKeywordTypeNode(SyntaxKind.StringKeyword);
      case StructureAttributeType.INT:
      case StructureAttributeType.FLOAT:
      case StructureAttributeType.TIMESTAMP:
      case StructureAttributeType.COUNT:
      case StructureAttributeType.AVERAGE:
      case StructureAttributeType.SUM:
        return factory.createKeywordTypeNode(SyntaxKind.NumberKeyword);
      case StructureAttributeType.BOOLEAN:
        return factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword);
      case StructureAttributeType.ARRAY:
        return factory.createTypeReferenceNode(
          factory.createIdentifier("Array"),
          typeParameter === "any"
            ? [factory.createKeywordTypeNode(SyntaxKind.AnyKeyword)]
            : [
                factory.createTypeReferenceNode(
                  factory.createIdentifier(
                    strategy.formatTypeName(typeParameter)
                  ),
                  undefined
                ),
              ]
        );
      case StructureAttributeType.CUSTOM:
        return typeParameter === "any"
          ? factory.createKeywordTypeNode(SyntaxKind.AnyKeyword)
          : factory.createTypeReferenceNode(
              factory.createIdentifier(strategy.formatTypeName(typeParameter)),
              undefined
            );

      default:
        throw new Error(`Unknown attribute type: ${type}`);
    }
  };

  /***************************************************************************
   * Build Type
   **************************************************************************/

  // is this attribute required?
  const required = !attribute.required
    ? factory.createToken(SyntaxKind.QuestionToken)
    : undefined;

  // define the property
  const prop = factory.createPropertySignature(
    undefined,
    factory.createIdentifier(strategy.formatAttributeName(attribute.name)),
    required,
    buildTypePropertyType()
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
};
