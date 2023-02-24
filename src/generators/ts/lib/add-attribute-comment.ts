import { Attribute } from "../../../model";
import { TypeScriptSource } from "../typescript-source";

export const addAttributeComment = (f: TypeScriptSource, a: Attribute) => {
  f.line(`/**`);
  a.comment.forEach((c) => f.line(` * ${c}`));
  f.line(` */`);
};
