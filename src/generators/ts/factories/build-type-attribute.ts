import { SyntaxKind, addSyntheticLeadingComment, factory } from "typescript";
import { ResourceAttributeType } from "../../../services";
import { Service } from "../../../services/service";
import { StructureAttribute } from "../../../services/structure-attribute";
import { TypescriptStrategy } from "../strategy";

/**
 * Turns and array of StructureAttributes into Typescript properties.
 */
export const buildTypeProperies = ({
  service,
  attributes,
}: {
  service: Service;
  attributes: Array<StructureAttribute>;
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
  service: Service;
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
        return factory.createKeywordTypeNode(SyntaxKind.StringKeyword);
      case ResourceAttributeType.INT:
      case ResourceAttributeType.FLOAT:
      case ResourceAttributeType.TIMESTAMP:
      case ResourceAttributeType.COUNT:
      case ResourceAttributeType.AVERAGE:
      case ResourceAttributeType.SUM:
        return factory.createKeywordTypeNode(SyntaxKind.NumberKeyword);
      case ResourceAttributeType.BOOLEAN:
        return factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword);
      case ResourceAttributeType.ARRAY:
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
      case ResourceAttributeType.MAP: // todo
        return factory.createTypeReferenceNode(
          factory.createIdentifier("Record"),
          [
            factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
            factory.createTypeReferenceNode(
              factory.createIdentifier(strategy.formatTypeName(typeParameter)),
              undefined
            ),
          ]
        );
      case ResourceAttributeType.ANY:
        return typeParameter === "any"
          ? factory.createKeywordTypeNode(SyntaxKind.AnyKeyword)
          : factory.createTypeReferenceNode(
              factory.createIdentifier(strategy.formatTypeName(typeParameter)),
              undefined
            );

      default:
      // do nothing by default
    }

    // if it's a resource type, use the resource name
    if (typeof type === "string") {
      return factory.createTypeReferenceNode(
        factory.createIdentifier(strategy.formatTypeName(type)),
        undefined
      );
    }

    // if we get to here, something is broken.
    throw new Error(`Unknown attribute type: ${type}`);
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
