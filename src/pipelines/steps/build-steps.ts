import { JobStep } from "projen/lib/github/workflows-model";
import { renderSetupNodeSteps } from "./setup-node-steps";
import { Workflow } from "../workflow";

export const renderBuildSteps = (workflow: Workflow): Array<JobStep> => {
  const steps: Array<JobStep> = [];

  // checkout repo
  steps.push({
    name: "Checkout",
    uses: "actions/checkout@v3",
    with: {
      ...(workflow.ref ? { ref: workflow.ref } : {}),
      ...(workflow.repository ? { repository: workflow.repository } : {}),
      ...(workflow.downloadLfs ? { lfs: true } : {}),
    },
  });
  // setup node
  steps.push(...renderSetupNodeSteps(workflow));

  steps.push({
    name: "Install dependencies",
    run: workflow.mutableBuild
      ? workflow.project.package.installAndUpdateLockfileCommand
      : workflow.project.package.installCommand,
  });

  steps.push({
    name: workflow.project.buildTask.name,
    run: workflow.github.project.runTaskCommand(workflow.project.buildTask),
  });

  return steps;
};
