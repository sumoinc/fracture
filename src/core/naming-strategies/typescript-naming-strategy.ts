import { camelCase, paramCase, pascalCase } from "change-case";
import { Component } from "projen";
import { ValueOf } from "type-fest";
import { NAMING_STRATEGY_TYPE } from "./naming-strategy";
import { Fracture } from "../fracture";

export type TypescriptNamingStrategyOptions = {
  attributeName?: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  className?: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  enumName?: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  fileName?: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  functionName?: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  functionParameterName?: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  interfaceName?: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  typeName?: ValueOf<typeof NAMING_STRATEGY_TYPE>;
};
export class TypescriptNamingStrategy extends Component {
  public readonly attributeName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  public readonly className: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  public readonly enumName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  public readonly fileName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  public readonly functionName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  public readonly functionParameterName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  public readonly interfaceName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  public readonly typeName: ValueOf<typeof NAMING_STRATEGY_TYPE>;

  constructor(
    fracture: Fracture,
    options: TypescriptNamingStrategyOptions = {}
  ) {
    super(fracture);

    /***************************************************************************
     * PROPS
     **************************************************************************/

    this.attributeName =
      options.attributeName ?? NAMING_STRATEGY_TYPE.CAMEL_CASE;
    this.className = options.className ?? NAMING_STRATEGY_TYPE.PASCAL_CASE;
    this.enumName = options.enumName ?? NAMING_STRATEGY_TYPE.PASCAL_CASE;
    this.fileName = options.fileName ?? NAMING_STRATEGY_TYPE.PARAM_CASE;
    this.functionName = options.functionName ?? NAMING_STRATEGY_TYPE.CAMEL_CASE;
    this.functionParameterName =
      options.functionParameterName ?? NAMING_STRATEGY_TYPE.CAMEL_CASE;
    this.interfaceName =
      options.interfaceName ?? NAMING_STRATEGY_TYPE.PASCAL_CASE;
    this.typeName = options.typeName ?? NAMING_STRATEGY_TYPE.PASCAL_CASE;
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
