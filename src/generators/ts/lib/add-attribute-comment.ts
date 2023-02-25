import { ShapeAttribute } from "../../../model";
import { TypeScriptSource } from "../typescript-source";

export const addShapeAttributeComment = (
  f: TypeScriptSource,
  a: ShapeAttribute
) => {
  f.line(`/**`);
  a.comment.forEach((c) => f.line(` * ${c}`));
  f.line(` */`);
};
