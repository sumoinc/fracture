import { addAttribute } from "./add-attribute";
import { addInterfaceComment } from "./add-interface-comment";
import { Entity } from "../../../model";
import { TypeScriptSource } from "../typescript-source";

export const addInterface = (f: TypeScriptSource, e: Entity) => {
  addInterfaceComment(f, e);

  f.open(`export interface ${e.name} {`);
  e.attributes.forEach((a) => {
    addAttribute(f, a);
  });
  f.close(`}`);
  f.line("\n");
};
