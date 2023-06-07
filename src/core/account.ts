import { Component } from "projen";
import { Organization } from "./organization";
import { OrganizationalUnit } from "./organizational-unit";
import { Region, RegionOptions } from "./region";

export interface AccountOptions {
  id: string;
  name?: string;
  rootEmail?: string;
  isManagementAccount?: boolean;
  organizationalUnit?: OrganizationalUnit;
}

export class Account extends Component {
  // member components
  public readonly regions: Region[];
  // parent
  public readonly organization: Organization;
  // all other options
  public readonly options: AccountOptions;

  constructor(organization: Organization, options: AccountOptions) {
    super(organization.project);

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
    const defaultOptions: Partial<AccountOptions> = {
      isManagementAccount: false,
    };
    this.options = { ...defaultOptions, ...options };

    // if OU defined, add account to OU
    if (this.options.organizationalUnit) {
      this.options.organizationalUnit.accounts.push(this);
    }

    // debugging output
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

  public get isManagementAccount() {
    return this.options.isManagementAccount;
  }

  public get organizationalUnit() {
    return this.options.organizationalUnit;
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
    const region = this.regions.find((r) => r.id === options.id);
    return region ? region : new Region(this, options);
  }
}
