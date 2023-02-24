import { addAttribute } from "./add-attribute";
import { addInterfaceComment } from "./add-interface-comment";
import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Entity } from "../../../model";
import { TypeScriptSource } from "../typescript-source";

export const addInterface = (f: TypeScriptSource, e: Entity) => {
  addInterfaceComment(f, e);

  const entityName = formatStringByNamingStrategy(
    e.name,
    e.fracture.namingStrategy.model.entityName
  );

  f.open(`export interface ${entityName} {`);
  e.attributes.forEach((a) => {
    addAttribute(f, a);
  });
  f.close(`}`);
  f.line("\n");
};
