import {
  NodeProject,
  NodeProjectOptions,
  Prettier,
} from "projen/lib/javascript";
import { SetOptional, SetRequired } from "type-fest";
import { Environment } from "./environments";

export type FractureProjectOptions = SetRequired<
  SetOptional<NodeProjectOptions, "defaultReleaseBranch">,
  "outdir"
>;

/**
 * Used by subclasses to specify deploy location(s) for each project
 */
export interface DeployOptions {
  /**
   * The branch prefix this deployment is targeting.
   *
   * @default - defaultReleaseBranch found in Settings()
   */
  readonly branchPrefix?: string;

  /**
   * Environemnt to deploy into.
   */
  readonly environment: Environment;
}

export class FractureProject extends NodeProject {
  constructor(
    public readonly parent: NodeProject,
    options: FractureProjectOptions
  ) {
    super({
      parent,
      defaultReleaseBranch: "main",
      // inherit from parent project
      license: parent.package.license,
      prettier: parent.prettier && parent.prettier instanceof Prettier,
      packageManager: parent.package.packageManager,
      pnpmVersion: parent.package.pnpmVersion,
      ...options,
    });

    // don't package
    this.packageTask.reset();
    // don't allow default to run in subprojects, otherwise it runs root and
    // causes unwanted recusion.
    this.defaultTask?.reset();
  }
}
