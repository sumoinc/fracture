import { SyntaxKind, addSyntheticLeadingComment, factory } from "typescript";
import { buildTypeProperies } from "./build-type-attribute";
import { FractureService } from "../../../core";
import { Structure } from "../../../core/structure";
import { TypescriptStrategy } from "../strategy";

/**
 * Turns and array of Structures into Typescript types.
 */
export const buildTypes = ({
  service,
  structures,
}: {
  service: FractureService;
  structures: Structure[];
}) => {
  return structures.map((structure) => {
    return buildType({
      service,
      structure,
    });
  });
};

/**
 * Turns one Structure into a Typescript type.
 */
export const buildType = ({
  service,
  structure,
}: {
  service: FractureService;
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
  const properties = buildTypeProperies({
    service,
    attributes: structure.attributes,
  });

  // define the type
  const type = factory.createTypeAliasDeclaration(
    [factory.createToken(SyntaxKind.ExportKeyword)],
    factory.createIdentifier(strategy.formatTypeName(structure.name)),
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
