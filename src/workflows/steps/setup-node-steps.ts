import { JobStep } from "projen/lib/github/workflows-model";
import { NodePackageManager } from "projen/lib/javascript";
import { Workflow } from "../workflow";

export const renderSetupNodeSteps = (workflow: Workflow): Array<JobStep> => {
  const steps: Array<JobStep> = [];

  // yarn and pnpm are already preinstalled, but pnpm is not
  if (workflow.project.package.packageManager === NodePackageManager.PNPM) {
    steps.push({
      name: "Setup pnpm",
      uses: "pnpm/action-setup@v2.2.4",
      with: { version: workflow.pnpmVersion },
    });
  }

  // cache output?
  const cache =
    workflow.project.package.packageManager === NodePackageManager.YARN
      ? "yarn"
      : workflow.project.package.packageManager === NodePackageManager.YARN2
      ? "yarn"
      : workflow.project.package.packageManager === NodePackageManager.PNPM
      ? "pnpm"
      : "npm";

  // setup node
  steps.push({
    name: "Setup Node.js",
    uses: "actions/setup-node@v3",
    with: {
      "node-version": workflow.nodeVersion,
      ...(workflow.packageCache
        ? {
            cache,
          }
        : {}),
    },
  });

  return steps;
};
