import { buildResourceAttributeComment } from "./build-attribute-comment";
import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import {
  ResourceAttribute,
  ResourceAttributeOptions,
} from "../../../core/resource-attribute";
import { TypeScriptSource } from "../typescript-source";

export const buildResourceAttribute = (
  f: TypeScriptSource,
  a: ResourceAttribute,
  options: Partial<ResourceAttributeOptions> = {}
) => {
  buildResourceAttributeComment(f, a);

  const attributeName = formatStringByNamingStrategy(
    a.name,
    a.fracture.namingStrategy.model.attributeName
  );

  // required?
  const isRequired = options.isRequired || a.isRequired ? "" : "?";

  // const q = a.isRequired ? "" : "?";
  f.line(`${attributeName}${isRequired}: ${a.typeScriptType};`);
};
