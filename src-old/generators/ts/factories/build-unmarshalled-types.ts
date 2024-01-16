import { SyntaxKind, addSyntheticLeadingComment, factory } from "typescript";
import { buildUnmarshalledProperies } from "./build-unmarshalled-properties";
import { Service } from "../../../services/service";
import { Structure } from "../../../services/structure";
import { TypescriptStrategy } from "../strategy";

/**
 * Turns and array of Structures into Typescript types.
 */
export const buildUnmarshalledTypes = ({
  service,
  structures,
}: {
  service: Service;
  structures: Array<Structure>;
}) => {
  return structures.map((structure) => {
    return buildUnmarshalledType({
      service,
      structure,
    });
  });
};

/**
 * Turns one Structure into a native dynamo shape.
 */
export const buildUnmarshalledType = ({
  service,
  structure,
}: {
  service: Service;
  structure: Structure;
}) => {
  /***************************************************************************
   * Get Strategy
   **************************************************************************/

  const strategy = TypescriptStrategy.of(service);

  if (!strategy) {
    throw new Error(`No TypescriptStrategy defined at the service level.`);
  }

  /***************************************************************************
   * Build Type
   **************************************************************************/

  // in case of MyType<T> or similar
  const typeParameter = structure.typeParameter
    ? [
        factory.createTypeParameterDeclaration(
          undefined,
          factory.createIdentifier(structure.typeParameter),
          undefined,
          undefined
        ),
      ]
    : undefined;

  // build properties for this type
  const properties = buildUnmarshalledProperies({
    service,
    attributes: structure.attributes,
  });

  // define the type
  const type = factory.createTypeAliasDeclaration(
    [factory.createToken(SyntaxKind.ExportKeyword)],
    factory.createIdentifier(
      strategy.formatTypeName(`${structure.name}-unmarshalled`)
    ),
    typeParameter,
    properties
  );

  // add comments if needed
  if (structure.comments.length) {
    addSyntheticLeadingComment(
      type,
      SyntaxKind.MultiLineCommentTrivia,
      `*\n * ${structure.comments.join("\n * ")}\n`,
      true
    );
  }

  return type;
};
