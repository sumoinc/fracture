import { Fracture, FractureComponent } from "../core";

export interface AccountOptions {
  account: string;
}

export class Account extends FractureComponent {
  public readonly account: string;

  constructor(fracture: Fracture, options: AccountOptions) {
    super(fracture);

    this.account = options.account;
  }
}
