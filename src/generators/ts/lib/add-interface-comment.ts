import { Entity } from "../../../model";
import { TypeScriptSource } from "../typescript-source";

export const addInterfaceComment = (f: TypeScriptSource, e: Entity) => {
  f.line(`/**`);
  e.comment.forEach((c) => f.line(` * ${c}`));
  f.line(` */`);
};
