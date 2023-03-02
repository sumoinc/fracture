import { ResourceAttribute } from "../../../core/resource-attribute";
import { TypeScriptSource } from "../typescript-source";

export const buildResourceAttributeComment = (
  f: TypeScriptSource,
  a: ResourceAttribute
) => {
  f.line(`/**`);
  a.comment.forEach((c) => f.line(` * ${c}`));
  f.line(` */`);
};
