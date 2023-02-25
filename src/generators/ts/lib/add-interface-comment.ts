import { Shape } from "../../../model";
import { TypeScriptSource } from "../typescript-source";

export const addInterfaceComment = (f: TypeScriptSource, e: Shape) => {
  f.line(`/**`);
  e.comment.forEach((c) => f.line(` * ${c}`));
  f.line(` */`);
};
