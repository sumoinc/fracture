import { camelCase, paramCase, pascalCase } from "change-case";
import { Component } from "projen";
import { ValueOf } from "type-fest";
import {
  AttributeNamingStrategy,
  AttributeNamingStrategyOptions,
} from "./attribute-naming-strategy";
import {
  TypescriptNamingStrategy,
  TypescriptNamingStrategyOptions,
} from "./typescript-naming-strategy";
import {
  VtlNamingStrategy,
  VtlNamingStrategyOptions,
} from "./vtl-naming-strategy";
import { Fracture } from "../fracture";
import { OPERATION_SUB_TYPE } from "../operation.ts-disabled";
import { STRUCTURE_TYPE } from "../structure.ts-disabled";

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

export type NamingStrategyOptions = {
  attribute?: AttributeNamingStrategyOptions;
  ts?: TypescriptNamingStrategyOptions;
  vtl?: VtlNamingStrategyOptions;
};

export class NamingStrategy extends Component {
  public readonly attribute: AttributeNamingStrategy;
  public readonly ts: TypescriptNamingStrategy;
  public readonly vtl: VtlNamingStrategy;

  constructor(fracture: Fracture, options: NamingStrategyOptions) {
    super(fracture);

    /***************************************************************************
     * PROPS
     **************************************************************************/

    this.attribute = new AttributeNamingStrategy(fracture, options.attribute);
    this.ts = new TypescriptNamingStrategy(fracture, options.ts);
    this.vtl = new VtlNamingStrategy(fracture, options.vtl);
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
