import { camelCase, paramCase, pascalCase } from "change-case";
import { Component } from "projen";
import { ValueOf } from "type-fest";
import { NAMING_STRATEGY_TYPE } from "./naming-strategy";
import { Fracture } from "../fracture";

export type VtlNamingStrategyOptions = {
  fileName?: ValueOf<typeof NAMING_STRATEGY_TYPE>;
};

export class VtlNamingStrategy extends Component {
  public readonly fileName: ValueOf<typeof NAMING_STRATEGY_TYPE>;

  constructor(fracture: Fracture, options: VtlNamingStrategyOptions = {}) {
    super(fracture);

    /***************************************************************************
     * PROPS
     **************************************************************************/

    this.fileName = options.fileName ?? NAMING_STRATEGY_TYPE.PARAM_CASE;
  }
}
