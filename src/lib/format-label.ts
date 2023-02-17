import { camelCase, pascalCase } from "change-case";
import { ValueOf } from "type-fest";
import { NamingStrategyType } from "../core";

export const formatLabel = (
  s: string,
  ns: ValueOf<typeof NamingStrategyType>
) => {
  switch (ns) {
    case NamingStrategyType.PASCAL_CASE:
      return pascalCase(s);
      break;
    case NamingStrategyType.CAMEL_CASE:
      return camelCase(s);
    default:
      throw new Error(`Invalid naming strategy ${ns}`);
      break;
  }
};
