import { Account } from "./account";
import { FractureComponent } from "./component";

export interface RegionOptions {
  id: string;
}

export class Region extends FractureComponent {
  // member components
  // parent
  public readonly account: Account;
  // all other options
  public readonly options: RegionOptions;

  constructor(account: Account, options: RegionOptions) {
    super(account.fracturePackage);

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
