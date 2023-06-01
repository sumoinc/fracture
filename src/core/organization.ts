import { Account, AccountOptions } from "./account";
import { FractureComponent } from "./component";
import { Fracture } from "./fracture";
import {
  OrganizationalUnit,
  OrganizationalUnitOptions,
} from "./organizational-unit";

export interface OrganizationOptions {
  id: string;
  ssoStartUrl?: string;
  ssoRegion?: string;
}

export class Organization extends FractureComponent {
  // member components
  public readonly accounts: Account[];
  public readonly organizationalUnits: OrganizationalUnit[];
  // parent
  // all other options
  public readonly options: OrganizationOptions;

  constructor(fracture: Fracture, options: OrganizationOptions) {
    super(fracture);

    /***************************************************************************
     *
     * INIT OPERATION
     *
     **************************************************************************/

    // member components
    this.accounts = [];
    this.organizationalUnits = [];

    // parents + inverse
    this.fracture.organizations.push(this);

    // all other options
    this.options = options;

    this.project.logger.info(`INIT Organization: "${this.id}"`);
  }

  public get id() {
    return this.options.id;
  }

  public get ssoStartUrl() {
    return this.options.ssoStartUrl;
  }

  public get ssoRegion() {
    return this.options.ssoRegion;
  }

  public get managementAccount() {
    return this.accounts.find((a) => a.options.isManagementAccount);
  }

  public get managedAccounts() {
    return this.accounts.filter((a) => !a.options.isManagementAccount);
  }

  /*****************************************************************************
   *
   *  Configuration Helpers
   *
   ****************************************************************************/

  /**
   * Add an account to an organization.
   *
   * @param {AccountOptions}
   * @returns {Account}
   */
  public addAccount(options: AccountOptions) {
    return new Account(this, options);
  }

  /**
   * Add an organizational unit to an organization.
   *
   * @param {OrganizationalUnitOptions}
   * @returns {OrganizationalUnit}
   */
  public addOrganizationalUnit(options: OrganizationalUnitOptions) {
    return new OrganizationalUnit(this, options);
  }
}
