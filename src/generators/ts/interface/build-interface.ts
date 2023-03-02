import { buildResourceAttribute } from "./build-attribute";
import { buildInterfaceComment } from "./build-interface-comment";
import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Resource } from "../../../core/resource";
import { TypeScriptSource } from "../typescript-source";

export const buildInterface = (f: TypeScriptSource, e: Resource) => {
  buildInterfaceComment(f, e);

  const shapeName = formatStringByNamingStrategy(
    e.name,
    e.fracture.namingStrategy.model.shapeName
  );

  f.open(`export interface ${shapeName} {`);
  e.attributes.forEach((a) => {
    buildResourceAttribute(f, a);
  });
  f.close(`}`);
  f.line("\n");
};
