import { camelCase, paramCase, pascalCase } from "change-case";
import { Component } from "projen";
import { ValueOf } from "type-fest";
import { FractureService } from "../../core";
import { NAMING_STRATEGY_TYPE } from "../../core/naming-strategies/naming-strategy";

export type TypescriptStrategyOptions = {
  attributeName?: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  className?: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  enumName?: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  fileName?: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  functionName?: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  functionParameterName?: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  interfaceName?: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  typeName?: ValueOf<typeof NAMING_STRATEGY_TYPE>;
};

export class TypescriptStrategy extends Component {
  /**
   * Returns the `TypescriptStrategy` component for the service or
   * undefined if the service does not have a TypescriptStrategy component.
   */
  public static of(service: FractureService): TypescriptStrategy | undefined {
    const isTypescriptStrategy = (c: Component): c is TypescriptStrategy =>
      c instanceof TypescriptStrategy;
    return service.components.find(isTypescriptStrategy);
  }

  public readonly attributeName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  public readonly className: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  public readonly enumName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  public readonly fileName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  public readonly functionName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  public readonly functionParameterName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  public readonly interfaceName: ValueOf<typeof NAMING_STRATEGY_TYPE>;
  public readonly typeName: ValueOf<typeof NAMING_STRATEGY_TYPE>;

  constructor(
    service: FractureService,
    options: TypescriptStrategyOptions = {}
  ) {
    super(service);

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

  public formatAttributeName(s: string) {
    return format(s, this.attributeName);
  }

  public formatClassName(s: string) {
    return format(s, this.className);
  }

  public formatEnumName(s: string) {
    return format(s, this.enumName);
  }

  public formatFileName(s: string) {
    return format(s, this.fileName);
  }

  public formatFunctionName(s: string) {
    return format(s, this.functionName);
  }

  public formatFunctionParameterName(s: string) {
    return format(s, this.functionParameterName);
  }

  public formatInterfaceName(s: string) {
    return format(s, this.interfaceName);
  }

  public formatTypeName(s: string) {
    return format(s, this.typeName);
  }
}

const format = (s: string, ns: ValueOf<typeof NAMING_STRATEGY_TYPE>) => {
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
