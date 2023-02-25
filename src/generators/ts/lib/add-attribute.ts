import { addShapeAttributeComment } from "./add-attribute-comment";
import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { ShapeAttribute } from "../../../model";
import { TypeScriptSource } from "../typescript-source";

export const addShapeAttribute = (f: TypeScriptSource, a: ShapeAttribute) => {
  addShapeAttributeComment(f, a);

  const attributeName = formatStringByNamingStrategy(
    a.name,
    a.fracture.namingStrategy.model.attributeName
  );

  const q = a.isRequired ? "" : "?";
  f.line(`${attributeName}${q}: ${a.typeScriptType};`);
};
