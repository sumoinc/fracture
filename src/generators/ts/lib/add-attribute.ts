import { addAttributeComment } from "./add-attribute-comment";
import { Attribute } from "../../../model";
import { TypeScriptSource } from "../typescript-source";

export const addAttribute = (f: TypeScriptSource, a: Attribute) => {
  addAttributeComment(f, a);

  const q = a.isRequired ? "" : "?";
  f.line(`${a.name}${q}: ${a.typeScriptType};`);
};
