import { TypeScriptProject } from "projen/lib/typescript";
import { SetOptional, ValueOf } from "type-fest";
import { Environment, EnvironmentOptions } from "./environment";
import { Settings } from "../settings";

export const AwsRegion = {
  US_EAST_1: "us-east-1",
  US_EAST_2: "us-east-2",
  US_WEST_1: "us-west-1",
  US_WEST_2: "us-west-2",
} as const;

export interface AwsEnvironmentOptions
  extends SetOptional<EnvironmentOptions, "authProviderType"> {
  /**
   * Account number for this environment.
   */
  readonly account: string;

  /**
   * Region for this envirnoment.
   *
   * @default - uses default from Settings()
   */
  readonly region?: ValueOf<typeof AwsRegion>;

  /**
   * The role name that shuld ber used when constructing the OIDC role's ARN.
   *
   * @default - uses default from Settings()
   */
  readonly gitHubDeploymentOIDCRoleName?: string;

  /**
   * The duration of the role session in seconds.
   *
   * @default - uses default from Settings()
   */
  readonly gitHubDeploymentOIDCRoleDurationSeconds?: number;
}

export class AwsEnvironment extends Environment {
  /**
   * Account for this environment.
   */
  public readonly account: string;

  /**
   * Region for this envirnoment.
   *
   * @default - uses default from Settings()
   */
  public readonly region: ValueOf<typeof AwsRegion>;

  /**
   * The role name that should be used when constructing the OIDC role's ARN.
   *
   * @default - uses default from Settings()
   */
  public readonly gitHubDeploymentOIDCRoleName: string;

  /**
   * The duration of the role session in seconds.
   *
   * @default - uses default from Settings()
   */
  public readonly gitHubDeploymentOIDCRoleDurationSeconds: number;

  constructor(
    public readonly project: TypeScriptProject,
    options: AwsEnvironmentOptions
  ) {
    // grab some default settings
    const {
      region,
      authProviderType,
      gitHubDeploymentOIDCRoleName,
      gitHubDeploymentOIDCRoleDurationSeconds,
    } = Settings.of(project).defaultAwsEnviromentOptions;

    super(project, { authProviderType, ...options });

    // defaults
    this.account = options.account;
    this.region = options.region ?? region;
    //this.authProviderType = options.authProviderType ?? authProviderType;
    this.gitHubDeploymentOIDCRoleName =
      options.gitHubDeploymentOIDCRoleName ?? gitHubDeploymentOIDCRoleName;
    this.gitHubDeploymentOIDCRoleDurationSeconds =
      options.gitHubDeploymentOIDCRoleDurationSeconds ??
      gitHubDeploymentOIDCRoleDurationSeconds;
  }

  /*****************************************************************************
   * Configuration export for this environment
   ****************************************************************************/

  public config(): Record<string, any> {
    return {
      ...super.config(),
      account: this.account,
      region: this.region,
      gitHubDeploymentOIDCRoleName: this.gitHubDeploymentOIDCRoleName,
      gitHubDeploymentOIDCRoleDurationSeconds:
        this.gitHubDeploymentOIDCRoleDurationSeconds,
    };
  }
}
