import { camelCase, paramCase, pascalCase } from "change-case";
import { ValueOf } from "type-fest";
import { OPERATION_SUB_TYPE } from "./operation";
import { STRUCTURE_TYPE } from "./structure";

export const NAMING_STRATEGY_TYPE = {
  /**
   * PascalCase
   */
  PASCAL_CASE: "pascalCase",
  /**
   * camelCase
   */
  CAMEL_CASE: "camelCase",
  /**
   * snake_case
   */
  SNAKE_CASE: "snakeCase",
  /**
   * param-case
   */
  PARAM_CASE: "paramCase",
  /**
   * CONSTANT_CASE
   */
  CONSTANT_CASE: "constantCase",
} as const;

export type NamingStrategy = {
  ts: {
    attributeName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
    className: ValueOf<typeof NAMING_STRATEGY_TYPE>;
    enumName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
    fileName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
    functionName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
    functionParameterName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
    interfaceName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
    typeName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  };
  appsync: {
    vtl: {
      file: ValueOf<typeof NAMING_STRATEGY_TYPE>;
    };
  };
  structures: {
    prefixes: {
      [key in ValueOf<typeof STRUCTURE_TYPE>]: string;
    };
    suffixes: {
      [key in ValueOf<typeof STRUCTURE_TYPE>]: string;
    };
  };
  operations: {
    prefixes: {
      [key in ValueOf<typeof OPERATION_SUB_TYPE>]: string;
    };
    suffixes: {
      [key in ValueOf<typeof OPERATION_SUB_TYPE>]: string;
    };
  };
};

export const formatStringByNamingStrategy = (
  s: string,
  ns: ValueOf<typeof NAMING_STRATEGY_TYPE>
) => {
  switch (ns) {
    case NAMING_STRATEGY_TYPE.CAMEL_CASE:
      return camelCase(s);
    case NAMING_STRATEGY_TYPE.PARAM_CASE:
      return paramCase(s);
    case NAMING_STRATEGY_TYPE.PASCAL_CASE:
      return pascalCase(s);
    default:
      throw new Error(`Invalid naming strategy ${ns}`);
  }
};
