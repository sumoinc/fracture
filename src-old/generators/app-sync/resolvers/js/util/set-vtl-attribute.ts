import { ResourceAttributeGenerator } from "../../../../../services/resource-attribute";
import { StructureAttribute } from "../../../../../services/structure-attribute";
import { TypescriptStrategy } from "../../../../ts/strategy";

export const setVtlAttribute = (attribute: StructureAttribute) => {
  const strategy = TypescriptStrategy.of(attribute.project);
  const generator = attribute.generator;
  const name = strategy.formatAttributeName(attribute.name);
  const shortName = strategy.formatAttributeName(attribute.shortName);

  // non-generated
  if (generator === ResourceAttributeGenerator.NONE) {
    return `"${shortName}": $util.dynamodb.toDynamoDBJson($ctx.args.input.${name}),`;
    // generated values
  } else {
    switch (generator) {
      case ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP:
        return `"${shortName}": "$util.time.nowISO8601()"`;
      case ResourceAttributeGenerator.GUID:
        return `"${shortName}": "$util.autoId()"`;
      case ResourceAttributeGenerator.TYPE:
        return `"${shortName}": "unknown"`;

      default:
        throw new Error(`Unknown generator: ${generator}`);
    }
  }
};
