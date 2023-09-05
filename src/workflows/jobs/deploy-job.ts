import { paramCase } from "change-case";
import { Job, JobPermission, JobStep } from "projen/lib/github/workflows-model";
import { SetOptional } from "type-fest";
import { WorkflowJob, WorkflowJobOptions } from "./workflow-job";
import { Environment } from "../../environments";
import { renderDeploySteps } from "../steps/deploy-steps";
import { renderDownloadArtifactSteps } from "../steps/download-artifact-steps";
import { renderSetupNodeSteps } from "../steps/setup-node-steps";
import { Workflow } from "../workflow";

export interface DeployJobOptions
  extends SetOptional<WorkflowJobOptions, "jobId" | "name"> {
  /**
   * The branch pattern this deployment is targeting.
   *
   * @default main
   */
  readonly branchPrefix?: string;

  /**
   * Jobs that must complete before this one may run
   *
   * @default - the build job
   */
  readonly needs?: Array<string>;

  /**
   * Step definition(s) that conduct the deployment
   */
  readonly deploySteps: Array<JobStep>;

  /**
   * Environment deploying to.
   */
  readonly environment: Environment;
}

export class DeployJob extends WorkflowJob {
  /**
   * The branch pattern this deployment is targeting.
   *
   * @default main
   */
  readonly branchPrefix: string;

  /**
   * Jobs that must complete before this one may run
   *
   * @default - the build job
   */
  readonly needs: Array<string>;

  /**
   * Step definition(s) that conduct the deployment
   */
  readonly deploySteps: Array<JobStep>;

  /**
   * Environment deploying to.
   */
  readonly environment: Environment;

  constructor(public readonly workflow: Workflow, options: DeployJobOptions) {
    const branchPrefix = options.branchPrefix ?? "main";
    const name = options.name ?? `Deploy ${branchPrefix}`;
    const jobId = options.jobId ?? paramCase(name);

    super(workflow, {
      jobId,
      name,
      ...options,
    });

    // defaults
    this.branchPrefix = branchPrefix;
    this.needs = [workflow.buildJob.jobId, ...(options.needs ?? [])];
    this.deploySteps = options.deploySteps;
    this.environment = options.environment;

    // add this branch pattern as a trigger for the workflow
    workflow.addPushTrigger(this.branchPrefix);

    // make sure build step will store the artifacts we need
    workflow.buildJob.artifactDirectories.push(...this.artifactDirectories);
  }

  dependsOn = (job: WorkflowJob): void => {
    this.needs.push(job.jobId);
  };

  render = (): Job => {
    return {
      name: this.name,
      runsOn: this.workflow.defaultRunners,
      needs: this.needs,
      concurrency: `deploy-${this.environment.name}`,
      if: `startsWith( github.ref, 'refs/heads/${this.branchPrefix}' )`,
      env: {
        CI: "true",
      },
      permissions: {
        contents: JobPermission.READ,
        ...(this.environment.authProviderType === "AWS_GITHUB_OIDC"
          ? {
              idToken: JobPermission.WRITE,
            }
          : {}),
      },
      steps: [
        ...renderDownloadArtifactSteps(this),
        ...renderSetupNodeSteps(this.workflow, { packageCache: false }),
        ...renderDeploySteps(this),
      ],
    };
  };
}
