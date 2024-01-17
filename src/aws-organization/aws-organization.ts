import { Component } from "projen";
import { ValueOf } from "type-fest";
import { AwsAccount } from "./aws-account";
import { AwsRegionIdentifier } from "./aws-region";
import { CdkProject } from "../projects";

export interface AwsOrganizationOptions {
  readonly orgId: string;
  readonly ssoStartUrl: string;
  readonly ssoAccount: string;

  /**
   * @default AwsRegionIdentifier.US_EAST_1
   */
  readonly ssoRegion?: ValueOf<typeof AwsRegionIdentifier>;
}

export class AwsOrganization extends Component {
  public static all(project: CdkProject): Array<AwsOrganization> {
    const isDefined = (c: Component): c is AwsOrganization =>
      c instanceof AwsOrganization;
    return project.components.filter(isDefined);
  }

  public readonly orgId: string;
  public readonly ssoStartUrl: string;
  public readonly ssoAccount: string;
  public readonly ssoRegion: ValueOf<typeof AwsRegionIdentifier>;

  constructor(
    public readonly project: CdkProject,
    options: AwsOrganizationOptions
  ) {
    super(project);

    /***************************************************************************
     *
     * DEFAULTS
     *
     **************************************************************************/

    this.orgId = options.orgId;
    this.ssoStartUrl = options.ssoStartUrl;
    this.ssoAccount = options.ssoAccount;
    this.ssoRegion = options.ssoRegion ?? AwsRegionIdentifier.US_EAST_1;
  }

  public get accounts() {
    return AwsAccount.all(this.project).filter((a) => a.orgId === this.orgId);
  }

  public hasAccount(account: string): boolean {
    return this.accounts.some((a) => a.account === account);
  }

}
