import { paramCase } from "change-case";
import { Component } from "projen";
import { ValueOf } from "type-fest";
import { Account } from "./account";
import { Fracture } from "./fracture";
import { REGION_IDENTITIER } from "./region";

export interface EnvironmentOptions {
  /**
   * Friendly name for environment
   */
  name: string;
  /**
   * Account for this environment.
   */
  account: Account;
  /**
   * Region for this envirnoment.
   */
  region: ValueOf<typeof REGION_IDENTITIER>;
}

export class Environment extends Component {
  /**
   * Returns a environment by name, or undefined if it doesn't exist
   */
  public static byName(
    fracture: Fracture,
    name: string
  ): Environment | undefined {
    const isTypescriptStrategy = (c: Component): c is Environment =>
      c instanceof Environment && c.name === name;
    return fracture.components.find(isTypescriptStrategy);
  }
  /**
   * Friendly name for environment
   */
  public readonly name: string;
  /**
   * Account for this environment.
   */
  public readonly account: Account;
  /**
   * Region for this envirnoment.
   */
  public readonly region: ValueOf<typeof REGION_IDENTITIER>;

  constructor(fracture: Fracture, options: EnvironmentOptions) {
    super(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = paramCase(options.name);
    this.account = options.account;
    this.region = options.region;
  }
}
