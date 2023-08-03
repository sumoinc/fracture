import { paramCase } from "change-case";
import { Component } from "projen";
import { Environment } from "./environment";
import { DEPLOY_TASK_PREFIX } from "./pipeline-workflow";
import { Wave } from "./wave";

export interface StageOptions {
  name: string;
  environment: Environment;
}

/**
 * A stage is a deployment to a single environment.
 */
export class Stage extends Component {
  // all other options
  public readonly options: StageOptions;

  constructor(wave: Wave, options: StageOptions) {
    super(wave.project);

    this.options = options;

    // inverse
    wave.stages.push(this);

    // debugging output
    this.project.logger.info(`INIT Stage: `);
  }

  public get env() {
    return {
      account: this.account.id,
      region: this.region,
    };
  }

  public get id() {
    return paramCase(this.name);
  }

  public get taskName() {
    return `${DEPLOY_TASK_PREFIX}:${this.id}`;
  }

  public get name() {
    return this.options.name;
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
}
