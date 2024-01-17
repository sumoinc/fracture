import { paramCase } from "change-case";
import { Component } from "projen";
import { ValueOf } from "type-fest";
import { AwsOrganization } from "./aws-organization";
import { AwsRegionIdentifier } from "./aws-region";
import { CdkProject } from "../projects";

export const AwsProfileType = {
  SSO_LOGIN: "sso-login",
  BOOTSTRAP: "bootstrap",
  DEPLOYMENT: "deployment",
} as const;

export const AwsProfileRole = {
  ADMINISTRATOR_ACCESS: "AdministratorAccess",
} as const;

export interface AwsProfileOptions {
  readonly org: AwsOrganization;
  readonly account: string;
  readonly region: ValueOf<typeof AwsRegionIdentifier>;
  readonly profileType: ValueOf<typeof AwsProfileType>;
  // required for org SSO to work
  readonly ssoRoleName?: ValueOf<typeof AwsProfileRole>;
}

export class AwsProfile extends Component {
  public static all(project: CdkProject): Array<AwsProfile> {
    const isDefined = (c: Component): c is AwsProfile =>
      c instanceof AwsProfile;
    return project.components.filter(isDefined);
  }

  // from profile inputs
  readonly orgId: string;
  readonly account: string;
  readonly region: ValueOf<typeof AwsRegionIdentifier>;
  readonly profileType: ValueOf<typeof AwsProfileType>;

  // created from inputs
  readonly profileName: string;

  // from org level
  readonly ssoStartUrl: string;
  readonly ssoRegion: ValueOf<typeof AwsRegionIdentifier>;
  readonly ssoRoleName: ValueOf<typeof AwsProfileRole>;

  constructor(public readonly project: CdkProject, options: AwsProfileOptions) {
    super(project);

    /***************************************************************************
     *
     * DEFAULTS
     *
     **************************************************************************/

    this.orgId = options.org.orgId;
    this.account = options.account;
    this.region = options.region;
    this.profileType = options.profileType;
    this.profileName = paramCase(
      [options.profileType, options.account, options.region].join("-")
    );

    this.ssoStartUrl = options.org.ssoStartUrl;
    this.ssoRegion = options.org.ssoRegion;
    this.ssoRoleName =
      options.ssoRoleName ?? AwsProfileRole.ADMINISTRATOR_ACCESS; // TODO: downscope this
  }
}
