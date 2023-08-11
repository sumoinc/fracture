import { Component } from "projen";
import { ValueOf } from "type-fest";
import { Fracture } from "./fracture";
import { REGION_IDENTITIER } from "./region";

export interface StageOptions {
  /**
   * Name for tihs stage.
   */
  name: string;
  /**
   * Account for this stage.
   */
  account: string;
  /**
   * Region for this stage.
   */
  region: ValueOf<typeof REGION_IDENTITIER>;
}

/**
 * A stage is a deployment to a single environment.
 */
export class Stage extends Component {
  /**
   * Name for tihs stage.
   */
  public readonly name: string;
  /**
   * Account for this stage.
   */
  public readonly account: string;
  /**
   * Region for this stage.
   */
  public readonly region: ValueOf<typeof REGION_IDENTITIER>;
  /**
   * Env for this stage.
   */
  public readonly env: {
    account: string;
    region: ValueOf<typeof REGION_IDENTITIER>;
  };

  constructor(fracture: Fracture, options: StageOptions) {
    super(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = options.name;
    this.account = options.account;
    this.region = options.region;
    this.env = {
      account: this.account,
      region: this.region,
    };

    // debugging output
    this.project.logger.info(`INIT Stage: `);
  }

  /*
  public get id() {
    return paramCase(this.name);
  }*/

  /**
   * Deployment Job name to be used in YAML deployments
   */
  /*
  public get taskName() {
    return `${DEPLOY_TASK_PREFIX}:${this.id}`;
  }
  */
}
