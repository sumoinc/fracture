import { paramCase } from "change-case";
import { Component } from "projen";
import { Fracture } from "./fracture";

export interface AccountOptions {
  /**
   * Friendly name for account
   */
  name: string;
  /**
   * Account Number for this account
   */
  accountNumber?: string;
}

export class Account extends Component {
  /**
   * Returns an account by name, or undefined if it doesn't exist
   */
  public static byName(fracture: Fracture, name: string): Account | undefined {
    const isDefined = (c: Component): c is Account =>
      c instanceof Account && c.name === name;
    return fracture.components.find(isDefined);
  }
  /**
   * Returns an account by number, or undefined if it doesn't exist
   */
  public static byAccountNumber(
    fracture: Fracture,
    accountNumber: string
  ): Account | undefined {
    const isDefined = (c: Component): c is Account =>
      c instanceof Account && c.accountNumber === accountNumber;
    return fracture.components.find(isDefined);
  }
  /**
   * Friendly name for account
   */
  public readonly name: string;
  /**
   * Account Number for this account
   */
  public readonly accountNumber: string;

  constructor(fracture: Fracture, options: AccountOptions) {
    /***************************************************************************
     * Check Duplicates
     **************************************************************************/

    const name = paramCase(options.name);
    const accountNumber =
      options.accountNumber ?? fracture.defaultAccountNumber;

    if (Account.byName(fracture, name)) {
      throw new Error(`Duplicate account name "${name}".`);
    }
    if (Account.byAccountNumber(fracture, accountNumber)) {
      throw new Error(`Duplicate account number "${accountNumber}".`);
    }

    super(fracture);

    /***************************************************************************
     * Set Props
     **************************************************************************/

    this.name = name;
    this.accountNumber = accountNumber;

    /***************************************************************************
     * Add to Fracture
     **************************************************************************/

    fracture.accounts.push(this);
  }
}
