import { addShapeAttribute } from "./add-attribute";
import { addInterfaceComment } from "./add-interface-comment";
import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Shape } from "../../../model";
import { TypeScriptSource } from "../typescript-source";

export const addInterface = (f: TypeScriptSource, e: Shape) => {
  addInterfaceComment(f, e);

  const shapeName = formatStringByNamingStrategy(
    e.name,
    e.fracture.namingStrategy.model.shapeName
  );

  f.open(`export interface ${shapeName} {`);
  e.attributes.forEach((a) => {
    addShapeAttribute(f, a);
  });
  f.close(`}`);
  f.line("\n");
};
