import {
  NodeProject,
  NodeProjectOptions,
  Prettier,
} from "projen/lib/javascript";
import { SetOptional, SetRequired } from "type-fest";

export type FractureProjectOptions = SetRequired<
  SetOptional<NodeProjectOptions, "defaultReleaseBranch">,
  "outdir"
> & {
  /**
   * Release branch for this project.
   *
   * @default - fracture default
   */
  releaseBranch?: string;
};

export class FractureProject extends NodeProject {
  /**
   * Release branch for this project.
   *
   * @default - fracture default
   */
  releaseBranch?: string;

  constructor(
    public readonly parent: NodeProject,
    options: FractureProjectOptions
  ) {
    super(fractureProjectOptions(parent, options));

    // initialize the project
    fractureProjectInit(this);
  }
}

export const fractureProjectOptions = (
  parent: NodeProject,
  options: FractureProjectOptions
) => {
  return {
    parent,
    defaultReleaseBranch: "main",
    // inherit from parent project
    license: parent.package.license,
    prettier: parent.prettier && parent.prettier instanceof Prettier,
    packageManager: parent.package.packageManager,
    pnpmVersion: parent.package.pnpmVersion,
    eslintOptions: {
      dirs: ["src"],
      tsconfigPath: "./**/tsconfig.dev.json",
    },
    ...options,
  };
};

export const fractureProjectInit = (project: NodeProject) => {
  // don't package
  project.packageTask.reset();
  // don't allow default to run in subprojects, otherwise it runs root and
  // causes unwanted recusion.
  project.defaultTask?.reset();
};
