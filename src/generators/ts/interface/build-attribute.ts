import { buildShapeAttributeComment } from "./build-attribute-comment";
import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { ShapeAttribute, ShapeAttributeOptions } from "../../../model";
import { TypeScriptSource } from "../typescript-source";

export const buildShapeAttribute = (
  f: TypeScriptSource,
  a: ShapeAttribute,
  options: Partial<ShapeAttributeOptions> = {}
) => {
  buildShapeAttributeComment(f, a);

  const attributeName = formatStringByNamingStrategy(
    a.name,
    a.fracture.namingStrategy.model.attributeName
  );

  // required?
  const isRequired = options.isRequired || a.isRequired ? "" : "?";

  // const q = a.isRequired ? "" : "?";
  f.line(`${attributeName}${isRequired}: ${a.typeScriptType};`);
};
