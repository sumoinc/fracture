import { paramCase } from "change-case";
import { Component } from "projen";
import { NodeProject } from "projen/lib/javascript";

export interface AccountOptions {
  /**
   * Friendly name for account
   */
  name?: string;
  /**
   * Account Number for this account
   */
  accountNumber: string;
}

export class Account extends Component {
  /**
   * Returns an account by name, or undefined if it doesn't exist
   */
  public static byName(
    project: NodeProject,
    name: string
  ): Account | undefined {
    const isDefined = (c: Component): c is Account =>
      c instanceof Account && c.name === name;
    return project.components.find(isDefined);
  }
  /**
   * Returns an account by number, or undefined if it doesn't exist
   */
  public static byAccountNumber(
    project: NodeProject,
    accountNumber: string
  ): Account | undefined {
    const isDefined = (c: Component): c is Account =>
      c instanceof Account && c.accountNumber === accountNumber;
    return (
      project.components.find(isDefined) ??
      new Account(project, { accountNumber })
    );
  }
  /**
   * Friendly name for account
   */
  public readonly name: string;
  /**
   * Account Number for this account
   */
  public readonly accountNumber: string;

  constructor(public readonly project: NodeProject, options: AccountOptions) {
    /***************************************************************************
     * Check Duplicates
     **************************************************************************/

    const accountNumber = options.accountNumber;
    const name = paramCase(`account-${accountNumber}`);

    if (Account.byAccountNumber(project, accountNumber)) {
      throw new Error(`Duplicate account number "${accountNumber}".`);
    }

    super(project);

    /***************************************************************************
     * Set Props
     **************************************************************************/

    this.name = name;
    this.accountNumber = accountNumber;
  }
}
