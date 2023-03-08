import { FractureComponent } from ".";
import { Organization } from "./organization";

export interface AccountOptions {
  accountNo: string;
}

export class Account extends FractureComponent {
  // member components
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

    // parents + inverse
    this.organization = organization;
    this.organization.accounts.push(this);

    // all other options
    this.options = options;
  }
}
