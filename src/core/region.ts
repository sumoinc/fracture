import { Component } from "projen";
import { Account } from "./account";

export interface RegionOptions {
  id: string;
}

export class Region extends Component {
  // member components
  // parent
  public readonly account: Account;
  // all other options
  public readonly options: RegionOptions;

  constructor(account: Account, options: RegionOptions) {
    super(account.project);

    /***************************************************************************
     *
     * INIT OPERATION
     *
     **************************************************************************/

    // member components

    // parents + inverse
    this.account = account;
    this.account.regions.push(this);

    // all other options
    this.options = options;

    this.project.logger.info(`INIT Region: "${this.id}"`);
  }

  public get id() {
    return this.options.id;
  }
}
