import { camelCase, paramCase, pascalCase } from "change-case";
import { Component } from "projen";
import { ValueOf } from "type-fest";
import {
  TypescriptNamingStrategy,
  TypescriptNamingStrategyOptions,
} from "./typescript-naming-strategy";
import { Fracture } from "../fracture";
import { OPERATION_SUB_TYPE } from "../operation.ts-disabled";
import { STRUCTURE_TYPE } from "../structure.ts-disabled";

export type StructureNamingStrategyOptions = {
  prefixes: {
    [key in ValueOf<typeof STRUCTURE_TYPE>]: string;
  };
  suffixes: {
    [key in ValueOf<typeof STRUCTURE_TYPE>]: string;
  };
};

export class StructureNamingStrategy extends Component {
  public readonly appSync: Required<AppSyncNamingOptions>;
  public readonly attributes: Required<AttributeNamingOptions>;
  public readonly operations: Required<OperationNamingOptions>;
  public readonly structures: Required<StructureNamingOptions>;
  public readonly ts: TypescriptNamingStrategy;

  constructor(fracture: Fracture, options: NamingStrategyOptions) {
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
