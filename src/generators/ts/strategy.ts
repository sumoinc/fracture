import { camelCase, paramCase, pascalCase } from "change-case";
import { Component } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { ValueOf } from "type-fest";

export const NamingStrategyType = {
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

export type TypescriptStrategyOptions = {
  attributeName?: ValueOf<typeof NamingStrategyType>;
  className?: ValueOf<typeof NamingStrategyType>;
  enumName?: ValueOf<typeof NamingStrategyType>;
  fileName?: ValueOf<typeof NamingStrategyType>;
  functionName?: ValueOf<typeof NamingStrategyType>;
  functionParameterName?: ValueOf<typeof NamingStrategyType>;
  interfaceName?: ValueOf<typeof NamingStrategyType>;
  typeName?: ValueOf<typeof NamingStrategyType>;
};

export class TypescriptStrategy extends Component {
  /**
   * Returns the `TypescriptStrategy` component for the service or
   * undefined if the service does not have a TypescriptStrategy component.
   */
  public static of(project: NodeProject): TypescriptStrategy | undefined {
    const isDefined = (c: Component): c is TypescriptStrategy =>
      c instanceof TypescriptStrategy;
    return project.components.find(isDefined);
  }

  public readonly attributeName: ValueOf<typeof NamingStrategyType>;
  public readonly className: ValueOf<typeof NamingStrategyType>;
  public readonly enumName: ValueOf<typeof NamingStrategyType>;
  public readonly fileName: ValueOf<typeof NamingStrategyType>;
  public readonly functionName: ValueOf<typeof NamingStrategyType>;
  public readonly functionParameterName: ValueOf<typeof NamingStrategyType>;
  public readonly interfaceName: ValueOf<typeof NamingStrategyType>;
  public readonly typeName: ValueOf<typeof NamingStrategyType>;

  constructor(
    public readonly project: NodeProject,
    options: TypescriptStrategyOptions = {}
  ) {
    super(project);

    /***************************************************************************
     * PROPS
     **************************************************************************/

    this.attributeName = options.attributeName ?? NamingStrategyType.CAMEL_CASE;
    this.className = options.className ?? NamingStrategyType.PASCAL_CASE;
    this.enumName = options.enumName ?? NamingStrategyType.PASCAL_CASE;
    this.fileName = options.fileName ?? NamingStrategyType.PARAM_CASE;
    this.functionName = options.functionName ?? NamingStrategyType.CAMEL_CASE;
    this.functionParameterName =
      options.functionParameterName ?? NamingStrategyType.CAMEL_CASE;
    this.interfaceName =
      options.interfaceName ?? NamingStrategyType.PASCAL_CASE;
    this.typeName = options.typeName ?? NamingStrategyType.PASCAL_CASE;
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

const format = (s: string, ns: ValueOf<typeof NamingStrategyType>) => {
  switch (ns) {
    case NamingStrategyType.CAMEL_CASE:
      return camelCase(s);
    case NamingStrategyType.PARAM_CASE:
      return paramCase(s);
    case NamingStrategyType.PASCAL_CASE:
      return pascalCase(s);
    default:
      throw new Error(`Invalid naming strategy ${ns}`);
  }
};
