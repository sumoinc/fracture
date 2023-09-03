import { Component } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { ValueOf } from "type-fest";
import { AwsRegion } from "../environments/aws-environment";

export interface SettingsOptions {
  /**
   * Name for root project. This value is also used when geenrating certain
   * subproject naming as well as cdk stack names.
   *
   * @default "fracture"
   */
  readonly name?: string;

  /**
   * The default releast branch for this project and it's subprojects.
   *
   * @default "main"
   */
  readonly defaultReleaseBranch?: string;

  /**
   * The default region for this project. Used in many places such as defining environments and OIDC roles.
   *
   * @default "us-east-1"
   *
   **/
  readonly defaultRegion?: ValueOf<typeof AwsRegion>;

  /**
   * Root workspace for app subprojects
   *
   * @default "apps"
   */
  readonly appRoot?: string;

  /**
   * Root workspace for site subprojects
   *
   * @default "sites"
   */
  readonly siteRoot?: string;

  /**
   * The role name that shuld ber used when constructing the OIDC role's ARN.
   *
   * @default GitHubDeploymentOIDCRole
   */
  readonly gitHubDeploymentOIDCRoleName?: string;

  /**
   * The duration of the role session in seconds.
   *
   * @default 900
   */
  readonly gitHubDeploymentOIDCRoleDurationSeconds?: number;
}

export class Settings extends Component {
  /**
   * Returns the deployment workflow for a project or creates one if it
   * doesn't exist yet. Singleton?
   */
  public static of(root: NodeProject): Settings {
    const isDefined = (c: Component): c is Settings => c instanceof Settings;
    return root.components.find(isDefined) ?? new Settings(root);
  }

  /**
   * Name for root project. This value is also used when geenrating certain
   * subproject naming as well as cdk stack names.
   *
   * @default "fracture"
   */
  public readonly name: string;

  /**
   * The default releast branch for this project and it's subprojects.
   *
   * @default "main"
   */
  readonly defaultReleaseBranch: string;

  /**
   * The default regiun for this project. Used in many places such as defining environments and OIDC roles.
   *
   * @default "us-east-1"
   *
   **/
  public readonly defaultRegion: ValueOf<typeof AwsRegion>;

  /**
   * Root workspace for app subprojects
   *
   * @default "apps"
   */
  public readonly appRoot: string;

  /**
   * Root workspace for site subprojects
   *
   * @default "sites"
   */
  public readonly siteRoot: string;

  /**
   * The role name that shuld ber used when constructing the OIDC role's ARN.
   *
   * @default GitHubDeploymentOIDCRole
   */
  public readonly gitHubDeploymentOIDCRoleName: string;

  /**
   * The duration of the role session in seconds.
   *
   * @default 900
   */
  public readonly gitHubDeploymentOIDCRoleDurationSeconds: number;

  constructor(
    public readonly root: NodeProject,
    options: SettingsOptions = {}
  ) {
    super(root);

    // defaults
    this.name = options.name ?? "fracture";
    this.defaultReleaseBranch = options.defaultReleaseBranch ?? "main";
    this.defaultRegion = options.defaultRegion ?? "us-east-1";
    this.appRoot = options.appRoot ?? "apps";
    this.siteRoot = options.siteRoot ?? "sites";
    this.gitHubDeploymentOIDCRoleName =
      options.gitHubDeploymentOIDCRoleName ?? "GitHubDeploymentOIDCRole";
    this.gitHubDeploymentOIDCRoleDurationSeconds =
      options.gitHubDeploymentOIDCRoleDurationSeconds ?? 900;

    return this;
  }
}
