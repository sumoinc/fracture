import { pascalCase } from "change-case";
import { Component } from "projen";
import { Environment } from "./environment";
import { FractureApp } from "./fracture-app";

export interface DeploymentOptions {
  environment: Environment;
}

export class Deployment extends Component {
  // all other options
  public readonly options: DeploymentOptions;

  constructor(app: FractureApp, options: DeploymentOptions) {
    super(app.project);

    this.options = options;

    // inverse
    app.deployments.push(this);

    // debugging output
    this.project.logger.info(`INIT Deployment: "${this.name}"`);
  }

  public get env() {
    return {
      account: this.account.id,
      region: this.region,
    };
  }

  public get environment() {
    return this.options.environment;
  }

  public get region() {
    return this.environment.region;
  }

  public get account() {
    return this.environment.account;
  }

  public get name() {
    return pascalCase(this.account.name) + pascalCase(this.region);
  }
}
