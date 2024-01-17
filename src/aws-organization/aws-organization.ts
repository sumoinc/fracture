import { Component } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { ValueOf } from "type-fest";
import { AwsProfile, AwsProfileType } from "./aws-profile";
import { AwsRegionIdentifier } from "./aws-region";
import { BootstrapConfig } from "../projects/cdk/config/bootstrap-config";
import { BootstrapTask } from "../projects/cdk/tasks/bootstrap-task";
import { ProfileTask } from "../projects/cdk/tasks/profile-task";
import { SsoLoginTask } from "../projects/cdk/tasks/sso-login-task";

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
  public static all(project: TypeScriptProject): Array<AwsOrganization> {
    const isDefined = (c: Component): c is AwsOrganization =>
      c instanceof AwsOrganization;
    return project.components.filter(isDefined);
  }

  public readonly orgId: string;
  public readonly ssoStartUrl: string;
  public readonly ssoAccount: string;
  public readonly ssoRegion: ValueOf<typeof AwsRegionIdentifier>;

  constructor(
    public readonly project: TypeScriptProject,
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

  /**
   * Bootstrap an environment in this organization.
   *
   * @param options
   */
  public bootstrap = (options: {
    account: string;
    region: ValueOf<typeof AwsRegionIdentifier>;
    /**
     * What version to use when bootstrapping?
     *
     * @default latest
     */
    cdkVersion?: string;
  }) => {
    const profile = new AwsProfile(this.project, {
      org: this,
      account: options.account,
      region: options.region,
      profileType: AwsProfileType.BOOTSTRAP,
    });
    const config = new BootstrapConfig(this.project, {
      ...options,
      profileName: profile.profileName,
    });
    // task to do the work of bootstraping
    const bootstrapTask = new BootstrapTask(this.project, { config });
    const profileTask = new ProfileTask(this.project, { profile });
    return { profile, config, bootstrapTask, profileTask };
  };

  /**
   * Add a deployment profile for this organization
   *
   * @param options
   */
  public addDeploymentProfile = (options: {
    account: string;
    region: ValueOf<typeof AwsRegionIdentifier>;
  }) => {
    const profile = new AwsProfile(this.project, {
      org: this,
      account: options.account,
      region: options.region,
      profileType: AwsProfileType.DEPLOYMENT,
    });
    const profileTask = new ProfileTask(this.project, { profile });
    return { profile, profileTask };
  };

  /**
   * Add an SSO login profile for this organization.
   *
   * @param options
   */
  public addSsoLogin = (options: {
    account: string;
    region: ValueOf<typeof AwsRegionIdentifier>;
  }) => {
    const profile = new AwsProfile(this.project, {
      org: this,
      account: options.account,
      region: options.region,
      profileType: AwsProfileType.SSO_LOGIN,
    });
    const profileTask = new SsoLoginTask(this.project, { profile });
    return { profile, profileTask };
  };

  /*
  public get accounts() {
    return AwsAccount.all(this.project).filter((a) => a.orgId === this.orgId);
  }
  */

  /*
  public hasAccount(account: string): boolean {
    return this.accounts.some((a) => a.account === account);
  }
  */
}
