import { ValueOf } from "type-fest";
import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import {
  ResourceAttribute,
  ResourceAttributeGenerator,
} from "../../../core/resource-attribute";

export const setSytemResourceAttribute = (
  a: ResourceAttribute,
  g: ValueOf<typeof ResourceAttributeGenerator>
) => {
  switch (g) {
    case ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP:
      return `"${a.shortName}": "$util.time.nowISO8601()"`;
    case ResourceAttributeGenerator.GUID:
      return `"${a.shortName}": "$util.autoId()"`;
    case ResourceAttributeGenerator.TYPE:
      const resourceName = formatStringByNamingStrategy(
        a.resource.name,
        a.fracture.namingStrategy.model.shapeName
      );
      return `"${a.shortName}": "${resourceName}"`;
    case ResourceAttributeGenerator.VERSION:
      return `"${a.shortName}": "${a.resource.versioningStrategy.currentVersion}}"`;
    default:
      throw new Error(`Unknown generator: ${g}`);
  }
};
