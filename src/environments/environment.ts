import { paramCase } from "change-case";
import { Component } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { ValueOf } from "type-fest";
import { Settings } from "../core/fracture-settings";
import { REGION_IDENTITIER } from "./region";
import { AuthProviderType } from "../workflows/auth-provider";

export interface EnvironmentOptions {
  /**
   * Friendly name for environment
   */
  readonly name: string;

  /**
   * Account number for this environment.
   */
  readonly accountNumber: string;

  /**
   * Region for this envirnoment.
   *
   * @default - uses default from Settings()
   */
  readonly region?: ValueOf<typeof REGION_IDENTITIER>;

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

export class Environment extends Component {
  /**
   * Returns a environment by name, or undefined if it doesn't exist
   */
  public static byName(
    project: NodeProject,
    name: string
  ): Environment | undefined {
    const isDefined = (c: Component): c is Environment =>
      c instanceof Environment && c.name === name;
    return project.components.find(isDefined);
  }

  /**
   * Friendly name for environment
   */
  public readonly name: string;

  /**
   * Account for this environment.
   */
  public readonly accountNumber: string;

  /**
   * Region for this envirnoment.
   *
   * @default - uses default from Settings()
   */
  public readonly region: ValueOf<typeof REGION_IDENTITIER>;

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
    options: EnvironmentOptions
  ) {
    /***************************************************************************
     * Check Duplicates
     **************************************************************************/

    const name = paramCase(options.name);

    if (Environment.byName(project, name)) {
      throw new Error(`Duplicate environment name "${name}".`);
    }

    super(project);

    /***************************************************************************
     * Set Props
     **************************************************************************/

    const {
      defaultRegion,
      authProviderType,
      gitHubDeploymentOIDCRoleName,
      gitHubDeploymentOIDCRoleDurationSeconds,
    } = Settings.of(project);

    // defaults
    this.name = name;
    this.accountNumber = options.accountNumber;
    this.region = options.region ?? defaultRegion;
    this.authProviderType = options.authProviderType ?? authProviderType;
    this.gitHubDeploymentOIDCRoleName =
      options.gitHubDeploymentOIDCRoleName ?? gitHubDeploymentOIDCRoleName;
    this.gitHubDeploymentOIDCRoleDurationSeconds =
      options.gitHubDeploymentOIDCRoleDurationSeconds ??
      gitHubDeploymentOIDCRoleDurationSeconds;
  }
}
