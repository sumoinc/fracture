import {
  NodeProject,
  NodeProjectOptions,
  Prettier,
} from "projen/lib/javascript";
import { SetOptional, SetRequired } from "type-fest";

export type FractureProjectOptions = SetRequired<
  SetOptional<NodeProjectOptions, "defaultReleaseBranch">,
  "outdir"
>;

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
  }
}
