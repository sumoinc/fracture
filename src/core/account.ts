import { FractureComponent } from ".";
import { Organization } from "./organization";
import { Region } from "./region";

export interface AccountOptions {
  accountNo: string;
  name: string;
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

    this.project.logger.info(`INIT Account: "${this.accountNo}"`);
  }

  public get accountNo() {
    return this.options.accountNo;
  }

  public get name() {
    return this.options.name;
  }
}
