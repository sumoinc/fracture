import { Job, JobPermission } from "projen/lib/github/workflows-model";
import { SetOptional } from "type-fest";
import { WorkflowJob, WorkflowJobOptions } from "./workflow-job";
import { renderBuildSteps } from "../steps/build-steps";
import { renderUploadArtifactSteps } from "../steps/upload-artifact-steps";
import { Workflow } from "../workflow";

export interface BuildJobOptions
  extends SetOptional<WorkflowJobOptions, "jobId" | "name"> {}

export class BuildJob extends WorkflowJob {
  constructor(
    public readonly workflow: Workflow,
    options: BuildJobOptions = {}
  ) {
    super(workflow, {
      jobId: "build",
      name: "Build",
      ...options,
    });
  }

  render = (): Job => {
    return {
      name: "Build",
      runsOn: this.workflow.defaultRunners,
      env: {
        CI: "true",
      },
      permissions: {
        contents: JobPermission.WRITE,
      },
      steps: [
        ...renderBuildSteps(this.workflow),
        ...renderUploadArtifactSteps(this),
      ],
    };
  };
}
