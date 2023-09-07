import { Job, JobPermission } from "projen/lib/github/workflows-model";
import { TypeScriptProject } from "projen/lib/typescript";
import { SetOptional } from "type-fest";
import { WorkflowJob, WorkflowJobOptions } from "./workflow-job";
import { renderBuildSteps } from "../steps/build-steps";
import { renderUploadArtifactSteps } from "../steps/upload-artifact-steps";
import { Workflow } from "../workflow";

export interface BuildJobOptions
  extends SetOptional<WorkflowJobOptions, "jobId" | "name"> {
  /**
   * Workflow for build
   */
  readonly workflow: Workflow;
}

export class BuildJob extends WorkflowJob {
  /**
   * Workflow for build
   */
  public readonly workflow: Workflow;

  /**
   * Names of a directories that include build artifacts.
   */
  public readonly artifactDirectories: Array<string> = [];

  constructor(
    public readonly project: TypeScriptProject,
    options: BuildJobOptions
  ) {
    super(project, {
      jobId: "build",
      name: "Build",
      ...options,
    });

    // defaults
    this.workflow = options.workflow;
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
