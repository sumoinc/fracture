import { addAttributeComment } from "./add-attribute-comment";
import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Attribute } from "../../../model";
import { TypeScriptSource } from "../typescript-source";

export const addAttribute = (f: TypeScriptSource, a: Attribute) => {
  addAttributeComment(f, a);

  const attributeName = formatStringByNamingStrategy(
    a.name,
    a.fracture.namingStrategy.model.attributeName
  );

  const q = a.isRequired ? "" : "?";
  f.line(`${attributeName}${q}: ${a.typeScriptType};`);
};
