import { SyntaxKind, addSyntheticLeadingComment, factory } from "typescript";
import { JsType, jsType } from "./util";
import { Service } from "../../../services/service";
import { StructureAttribute } from "../../../services/structure-attribute";
import { TypescriptStrategy } from "../strategy";

/**
 * Turns an array of StructureAttributes into Typescript properties.
 */
export const buildUnmarshalledProperies = ({
  service,
  attributes,
}: {
  service: Service;
  attributes: Array<StructureAttribute>;
}) => {
  return factory.createTypeLiteralNode(
    attributes.map((attribute) => {
      return buildUnmarshalledProperty({
        service,
        attribute,
      });
    })
  );
};

/**
 * Turns one StructureAttribute into a Typescript property.
 */
export const buildUnmarshalledProperty = ({
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
    switch (jsType(type)) {
      case JsType.STRING:
        return factory.createKeywordTypeNode(SyntaxKind.StringKeyword);
      case JsType.NUMBER:
        return factory.createKeywordTypeNode(SyntaxKind.NumberKeyword);
      case JsType.BOOLEAN:
        return factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword);
      case JsType.ARRAY:
        if (!typeParameter) {
          throw new Error("Array type must have a type parameter");
        }
        return factory.createTypeReferenceNode(
          factory.createIdentifier("Array"),
          [
            factory.createTypeReferenceNode(
              factory.createIdentifier("Partial"),
              [
                factory.createTypeReferenceNode(
                  factory.createIdentifier(
                    strategy.formatTypeName(`${typeParameter}-unmarshalled`)
                  ),
                  undefined
                ),
              ]
            ),
          ]
        );
      case JsType.MAP:
        if (!typeParameter) {
          throw new Error("Map type must have a type parameter");
        }
        return factory.createTypeReferenceNode(
          factory.createIdentifier("Record"),
          [
            factory.createTypeReferenceNode(
              factory.createIdentifier("Partial"),
              [
                factory.createTypeReferenceNode(
                  factory.createIdentifier(
                    strategy.formatTypeName(`${typeParameter}-unmarshalled`)
                  ),
                  undefined
                ),
              ]
            ),
          ]
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
    factory.createIdentifier(strategy.formatAttributeName(attribute.shortName)),
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
