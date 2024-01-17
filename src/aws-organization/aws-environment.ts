import { Component } from "projen";
import { ValueOf } from "type-fest";
import { AwsRegionIdentifier } from "./aws-region";
import { CdkProject } from "../cdk";

export interface IAwsEnvironment {
  readonly orgId: string;
  readonly account: string;
  readonly region: ValueOf<typeof AwsRegionIdentifier>;
}

export interface AwsEnvironmentOptions {
  readonly orgId: string;
  readonly account: string;
  readonly region: ValueOf<typeof AwsRegionIdentifier>;
}

export class AwsEnvironment extends Component {
  public static all(project: CdkProject): Array<AwsEnvironment> {
    const isDefined = (c: Component): c is AwsEnvironment =>
      c instanceof AwsEnvironment;
    return project.components.filter(isDefined);
  }

  /**
   * Make sure this environment is configured for the organization.
   */
  public static ensureExists(
    project: CdkProject,
    options: AwsEnvironmentOptions
  ): AwsEnvironment {
    /**
     * Find function
     */
    const isDefined = (c: Component): c is AwsEnvironment =>
      c instanceof AwsEnvironment &&
      c.orgId === options.orgId &&
      c.account === options.account &&
      c.region === options.region;

    /**
     * It should exist in the project supplied.
     * Return this instance
     */
    return (
      project.components.find(isDefined) ?? new AwsEnvironment(project, options)
    );
  }

  public readonly orgId: string;
  public readonly account: string;
  public readonly region: ValueOf<typeof AwsRegionIdentifier>;

  constructor(
    public readonly project: CdkProject,
    options: AwsEnvironmentOptions
  ) {
    super(project);

    /***************************************************************************
     *
     * DEFAULTS
     *
     **************************************************************************/

    this.orgId = options.orgId;
    this.account = options.account;
    this.region = options.region;
  }

  public config(): IAwsEnvironment {
    return {
      orgId: this.orgId,
      account: this.account,
      region: this.region,
    };
  }
}
