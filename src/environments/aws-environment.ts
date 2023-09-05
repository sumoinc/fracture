import { NodeProject } from "projen/lib/javascript";
import { ValueOf } from "type-fest";
import {
  AuthProviderType,
  Environment,
  EnvironmentOptions,
} from "./environment";
import { Settings } from "../fracture-settings";

export const AwsRegion = {
  US_EAST_1: "us-east-1",
  US_EAST_2: "us-east-2",
  US_WEST_1: "us-west-1",
  US_WEST_2: "us-west-2",
} as const;

export interface AwsEnvironmentOptions extends EnvironmentOptions {
  /**
   * Account number for this environment.
   */
  readonly accountNumber: string;

  /**
   * Region for this envirnoment.
   *
   * @default - uses default from Settings()
   */
  readonly region?: ValueOf<typeof AwsRegion>;

  /**
   * Type of auth provider to use in this environment
   *
   * @default - uses default from Settings()
   */
  readonly authProviderType?: ValueOf<typeof AuthProviderType>;

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
  public readonly accountNumber: string;

  /**
   * Region for this envirnoment.
   *
   * @default - uses default from Settings()
   */
  public readonly region: ValueOf<typeof AwsRegion>;

  /**
   * Type of auth provider to use in this environment
   *
   * @default - uses default from Settings()
   */
  readonly authProviderType: ValueOf<typeof AuthProviderType>;

  /**
   * The role name that shuld ber used when constructing the OIDC role's ARN.
   *
   * @default - uses default from Settings()
   */
  readonly gitHubDeploymentOIDCRoleName: string;

  /**
   * The duration of the role session in seconds.
   *
   * @default - uses default from Settings()
   */
  readonly gitHubDeploymentOIDCRoleDurationSeconds: number;

  constructor(
    public readonly project: NodeProject,
    options: AwsEnvironmentOptions
  ) {
    super(project, options);

    // grab some core defaults
    const {
      defaultRegion,
      gitHubDeploymentOIDCRoleName,
      gitHubDeploymentOIDCRoleDurationSeconds,
    } = Settings.of(project);

    // defaults
    this.accountNumber = options.accountNumber;
    this.region = options.region ?? defaultRegion;
    this.authProviderType =
      options.authProviderType ?? AuthProviderType.AWS_GITHUB_OIDC;
    this.gitHubDeploymentOIDCRoleName =
      options.gitHubDeploymentOIDCRoleName ?? gitHubDeploymentOIDCRoleName;
    this.gitHubDeploymentOIDCRoleDurationSeconds =
      options.gitHubDeploymentOIDCRoleDurationSeconds ??
      gitHubDeploymentOIDCRoleDurationSeconds;
  }

  // public get authProvider(): AuthProvider {
  //   return AuthProvider.fromAwsEnvironment(this.project, this);
  // }
}
