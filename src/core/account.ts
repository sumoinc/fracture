import { FractureComponent } from ".";
import { Organization } from "./organization";

export interface AccountOptions {
  account: string;
}

export class Account extends FractureComponent {
  public readonly organization: Organization;
  public readonly account: string;

  constructor(organization: Organization, options: AccountOptions) {
    super(organization.fracture);

    this.organization = organization;
    this.account = options.account;
  }
}
