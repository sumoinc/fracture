import { Component } from "projen";
import { NodeProject } from "projen/lib/javascript";

export interface SettingsOptions {
  /**
   * Name for root project. This value is also used when geenrating certain
   * subproject naming as well as cdk stack names.
   *
   * @default "fracture"
   */
  readonly name?: string;

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
   * Root workspace for app subprojects
   *
   * @default "apps"
   */
  readonly appRoot: string;

  /**
   * Root workspace for site subprojects
   *
   * @default "sites"
   */
  readonly siteRoot: string;

  constructor(
    public readonly root: NodeProject,
    options: SettingsOptions = {}
  ) {
    super(root);

    // defaults
    this.name = options.name ?? "fracture";
    this.appRoot = options.appRoot ?? "apps";
    this.siteRoot = options.siteRoot ?? "sites";

    return this;
  }
}
