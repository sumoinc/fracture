import { FractureComponent } from ".";
import { Organization } from "./organization";
import { Region, RegionOptions } from "./region";

export interface AccountOptions {
  id: string;
  name?: string;
  rootEmail?: string;
}

export class Account extends FractureComponent {
  // member components
  public readonly regions: Region[];
  // parent
  public readonly organization: Organization;
  // all other options
  public readonly options: AccountOptions;

  constructor(organization: Organization, options: AccountOptions) {
    super(organization.fracture);

    /***************************************************************************
     *
     * INIT OPERATION
     *
     **************************************************************************/

    // member components
    this.regions = [];

    // parents + inverse
    this.organization = organization;
    this.organization.accounts.push(this);

    // all other options
    this.options = options;

    this.project.logger.info(`INIT Account: "${this.id}"`);
  }

  public get id() {
    return this.options.id;
  }

  public get name() {
    return this.options.name;
  }

  public get rootEmail() {
    return this.options.rootEmail;
  }

  /*****************************************************************************
   *
   *  Configuration Helpers
   *
   ****************************************************************************/

  /**
   * Add an region to an account.
   *
   * @param {RegionOptions}
   * @returns {Region}
   */
  public addRegion(options: RegionOptions) {
    return new Region(this, options);
  }
}
