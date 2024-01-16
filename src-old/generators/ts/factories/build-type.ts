import { SyntaxKind, addSyntheticLeadingComment, factory } from "typescript";
import { buildProperies } from "./build-properties";
import {
  ResourceAttributeGenerator,
  VisabilityType,
} from "../../../services/resource-attribute";
import { Service } from "../../../services/service";
import { Structure } from "../../../services/structure";
import { TypescriptStrategy } from "../strategy";

/**
 * Turns and array of Structures into Typescript types.
 */
export const buildTypes = ({
  service,
  structures,
}: {
  service: Service;
  structures: Array<Structure>;
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
  const properties = buildProperies({
    service,
    attributes: structure.attributes.filter((attribute) => {
      // exclude generated types, these are not public
      return (
        attribute.generator === ResourceAttributeGenerator.NONE &&
        attribute.visibility === VisabilityType.USER_VISIBLE
      );
    }),
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
