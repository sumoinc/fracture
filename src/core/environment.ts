import { pascalCase } from "change-case";
import { Component } from "projen";
import { Account } from "./account";
import { Fracture } from "./fracture";

export interface EnvironmentOptions {
  account: Account;
  region: string;
}

export class Environment extends Component {
  // all other options
  public readonly options: EnvironmentOptions;

  constructor(fracture: Fracture, options: EnvironmentOptions) {
    super(fracture);

    this.options = options;

    // inverse
    fracture.environments.push(this);

    // debugging output
    this.project.logger.info(`INIT Environment: "${this.name}"`);
  }

  public get region() {
    return this.options.region;
  }

  public get account() {
    return this.options.account;
  }

  public get name() {
    return pascalCase(this.account.name) + pascalCase(this.region);
  }
}
