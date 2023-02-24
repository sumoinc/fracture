import { ValueOf } from "type-fest";
import { formatStringByNamingStrategy } from "../../../../core/naming-strategy";
import { Attribute, AttributeGenerator } from "../../../../model";

export const setSytemAttribute = (
  a: Attribute,
  g: ValueOf<typeof AttributeGenerator>
) => {
  switch (g) {
    case AttributeGenerator.CURRENT_DATE_TIME_STAMP:
      return `"${a.shortName}": "$util.time.nowISO8601()"`;
    case AttributeGenerator.GUID:
      return `"${a.shortName}": "$util.autoId()"`;
    case AttributeGenerator.TYPE:
      const entityName = formatStringByNamingStrategy(
        a.entity.name,
        a.fracture.namingStrategy.model.entityName
      );
      return `"${a.shortName}": "${entityName}"`;
    default:
      throw new Error(`Unknown generator: ${g}`);
  }
};
