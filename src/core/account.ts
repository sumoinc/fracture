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
  accountNumber: string;
}

export class Account extends Component {
  /**
   * Friendly name for account
   */
  public readonly name: string;
  /**
   * Account Number for this account
   */
  public readonly accountNumber: string;

  constructor(fracture: Fracture, options: AccountOptions) {
    super(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = paramCase(options.name);
    this.accountNumber = options.accountNumber;
  }
}
