import { camelCase, paramCase, pascalCase } from "change-case";
import { ValueOf } from "type-fest";

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
  model: {
    interfaceName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
    attributeName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  };
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
  operations: {
    commandName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
    commands: {
      commandPrefix: string;
      commandSuffix: string;
      inputPrefix: string;
      inputSuffix: string;
      outputPrefix: string;
      outputSuffix: string;
    };
    crud: {
      createName: string;
      readName: string;
      updateName: string;
      deleteName: string;
      listName: string;
      importName: string;
    };
  };
};

export const defaultNamingStrategy: NamingStrategy = {
  model: {
    interfaceName: NAMING_STRATEGY_TYPE.PASCAL_CASE,
    attributeName: NAMING_STRATEGY_TYPE.CAMEL_CASE,
  },
  ts: {
    attributeName: NAMING_STRATEGY_TYPE.CAMEL_CASE,
    className: NAMING_STRATEGY_TYPE.PASCAL_CASE,
    enumName: NAMING_STRATEGY_TYPE.PASCAL_CASE,
    fileName: NAMING_STRATEGY_TYPE.PARAM_CASE,
    functionName: NAMING_STRATEGY_TYPE.CAMEL_CASE,
    functionParameterName: NAMING_STRATEGY_TYPE.CAMEL_CASE,
    interfaceName: NAMING_STRATEGY_TYPE.PASCAL_CASE,
    typeName: NAMING_STRATEGY_TYPE.PASCAL_CASE,
  },
  appsync: {
    vtl: {
      file: NAMING_STRATEGY_TYPE.PARAM_CASE,
    },
  },
  operations: {
    commandName: NAMING_STRATEGY_TYPE.PASCAL_CASE,
    commands: {
      commandPrefix: "",
      commandSuffix: "command",
      inputPrefix: "",
      inputSuffix: "input",
      outputPrefix: "",
      outputSuffix: "output",
    },
    crud: {
      createName: "create",
      readName: "read",
      updateName: "update",
      deleteName: "delete",
      listName: "list",
      importName: "import",
    },
  },
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
