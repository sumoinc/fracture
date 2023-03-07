import { Fracture, FractureComponent } from "../core";

export interface OrganizationOptions {
  orgId: string;
}

export class Organization extends FractureComponent {
  public readonly orgId: string;

  constructor(fracture: Fracture, options: OrganizationOptions) {
    super(fracture);

    this.orgId = options.orgId;
    this.fracture.organizations.push(this);
  }
}
