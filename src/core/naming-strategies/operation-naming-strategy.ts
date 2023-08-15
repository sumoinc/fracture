import { camelCase, paramCase, pascalCase } from "change-case";
import { Component } from "projen";
import { ValueOf } from "type-fest";

import { Fracture } from "../fracture";
import { OPERATION_SUB_TYPE } from "../operation.ts-disabled";

export type OperationNamingStrategyOptions = {
  prefixes?: {
    [key in ValueOf<typeof OPERATION_SUB_TYPE>]?: string;
  };
  suffixes?: {
    [key in ValueOf<typeof OPERATION_SUB_TYPE>]?: string;
  };
};

export class OperationNamingStrategy extends Component {
  constructor(
    fracture: Fracture,
    options: OperationNamingStrategyOptions = {}
  ) {
    super(fracture);

    /***************************************************************************
     * PROPS
     **************************************************************************/

    this.ts = new TypescriptNamingStrategy(fracture, options.ts);
  }
}

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
