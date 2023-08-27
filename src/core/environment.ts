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
  account?: Account;
  /**
   * Account number for this environment.
   */
  accountNumber?: string;
  /**
   * Region for this envirnoment.
   */
  region?: ValueOf<typeof REGION_IDENTITIER>;
}

export class Environment extends Component {
  /**
   * Returns a environment by name, or undefined if it doesn't exist
   */
  public static byName(
    fracture: Fracture,
    name: string
  ): Environment | undefined {
    const isDefined = (c: Component): c is Environment =>
      c instanceof Environment && c.name === name;
    return fracture.components.find(isDefined);
  }
  /**
   * Friendly name for environment
   */
  public readonly name: string;
  /**
   * Account for this environment.
   */
  public readonly accountNumber: string;
  /**
   * Region for this envirnoment.
   */
  public readonly region: ValueOf<typeof REGION_IDENTITIER>;

  constructor(fracture: Fracture, options: EnvironmentOptions) {
    /***************************************************************************
     * Resolve optional inputs
     **************************************************************************/

    if (options.account && options.accountNumber) {
      throw new Error(
        `Only one of "account" or "accountNumber" can be provided.`
      );
    }

    if (!options.account && !options.accountNumber) {
      options.accountNumber = fracture.defaultAccountNumber;
    }

    if (options.accountNumber) {
      options.account =
        Account.byAccountNumber(fracture, options.accountNumber) ??
        new Account(fracture, {
          name: `account-${options.accountNumber}`,
          accountNumber: options.accountNumber,
        });
    }

    /***************************************************************************
     * Check Duplicates
     **************************************************************************/

    const name = paramCase(options.name);

    if (Environment.byName(fracture, name)) {
      throw new Error(`Duplicate environment name "${name}".`);
    }

    super(fracture);

    /***************************************************************************
     * Set Props
     **************************************************************************/

    this.name = name;
    this.accountNumber = options.account!.accountNumber;
    this.region = options.region ?? fracture.defaultRegion;

    /***************************************************************************
     * Add to Fracture
     **************************************************************************/

    fracture.environments.push(this);
  }
}
