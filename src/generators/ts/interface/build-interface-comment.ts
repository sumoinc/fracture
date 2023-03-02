import { Resource } from "../../../core/resource";
import { TypeScriptSource } from "../typescript-source";

export const buildInterfaceComment = (f: TypeScriptSource, e: Resource) => {
  f.line(`/**`);
  e.comment.forEach((c) => f.line(` * ${c}`));
  f.line(` */`);
};
