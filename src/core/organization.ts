import { Account, AccountOptions } from "./account";
import { Fracture, FractureComponent } from "../core";

export interface OrganizationOptions {
  orgId: string;
  ssoStartUrl?: string;
}

export class Organization extends FractureComponent {
  // member components
  public readonly accounts: Account[];
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

    // parents + inverse
    this.fracture.organizations.push(this);

    // all other options
    this.options = options;

    this.project.logger.info(`INIT Organization: "${this.orgId}"`);
  }

  public get orgId() {
    return this.options.orgId;
  }

  public get ssoStartUrl() {
    return this.options.ssoStartUrl;
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
}
