import { Account, AccountOptions } from "./account";
import { FractureComponent } from "./component";
import { Organization } from "./organization";

export interface OrganizationalUnitOptions {
  name: string;
}

export class OrganizationalUnit extends FractureComponent {
  // member components
  public readonly accounts: Account[];
  public readonly organizationalUnits: OrganizationalUnit[];
  // parent
  public readonly organization: Organization;
  // all other options
  public readonly options: OrganizationalUnitOptions;

  constructor(organization: Organization, options: OrganizationalUnitOptions) {
    super(organization.fracture);

    /***************************************************************************
     *
     * INIT OPERATION
     *
     **************************************************************************/

    // member components
    this.accounts = [];
    this.organizationalUnits = [];

    // parents + inverse
    this.organization = organization;
    this.organization.organizationalUnits.push(this);

    // all other options
    this.options = options;

    this.project.logger.info(`INIT Organizational Unit: "${this.name}"`);
  }

  public get name() {
    return this.options.name;
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
    const acc = new Account(this.organization, options);
    this.accounts.push(acc);
    return acc;
  }
}
