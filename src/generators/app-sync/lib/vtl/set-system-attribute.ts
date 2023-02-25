import { ValueOf } from "type-fest";
import { formatStringByNamingStrategy } from "../../../../core/naming-strategy";
import { ShapeAttribute, ShapeAttributeGenerator } from "../../../../model";

export const setSytemShapeAttribute = (
  a: ShapeAttribute,
  g: ValueOf<typeof ShapeAttributeGenerator>
) => {
  switch (g) {
    case ShapeAttributeGenerator.CURRENT_DATE_TIME_STAMP:
      return `"${a.shortName}": "$util.time.nowISO8601()"`;
    case ShapeAttributeGenerator.GUID:
      return `"${a.shortName}": "$util.autoId()"`;
    case ShapeAttributeGenerator.TYPE:
      const shapeName = formatStringByNamingStrategy(
        a.shape.name,
        a.fracture.namingStrategy.model.shapeName
      );
      return `"${a.shortName}": "${shapeName}"`;
    default:
      throw new Error(`Unknown generator: ${g}`);
  }
};
