import { Account } from "./account";
import { Fracture, FractureComponent } from "../core";

export interface OrganizationOptions {
  orgId: string;
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

    this.project.logger.info(`INIT Organization: "${this.options.orgId}"`);
  }
}
