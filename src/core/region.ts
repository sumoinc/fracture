import { FractureComponent } from ".";
import { Account } from "./account";

export interface RegionOptions {
  regionId: string;
}

export class Region extends FractureComponent {
  // member components
  // parent
  public readonly account: Account;
  // all other options
  public readonly options: RegionOptions;

  constructor(account: Account, options: RegionOptions) {
    super(account.fracture);

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

    this.project.logger.info(`INIT Region: "${this.regionId}"`);
  }

  public get regionId() {
    return this.options.regionId;
  }
}
