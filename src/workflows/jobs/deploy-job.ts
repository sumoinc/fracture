import { paramCase } from "change-case";
import { Task } from "projen";
import { Job, JobPermission } from "projen/lib/github/workflows-model";
import { SetOptional } from "type-fest";
import { WorkflowJob, WorkflowJobOptions } from "./workflow-job";
import { AuthProvider } from "../auth-provider";
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
   * Projen Task that runs the deploy
   */
  readonly deployTask: Task;

  /**
   * Authprovider for this deployment
   */
  readonly authProvider: AuthProvider;
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
   * Projen Task that runs the deploy
   */
  readonly deployTask: Task;

  /**
   * Authprovider for this deployment
   */
  readonly authProvider: AuthProvider;

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
    this.deployTask = options.deployTask;
    this.authProvider = options.authProvider;

    // add branch pattern this as a trigger
    workflow.addPushTrigger(this.branchPrefix);

    // make sure build stores these
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
      if: `startsWith( github.ref, 'refs/heads/${this.branchPrefix}' )`,
      env: {
        CI: "true",
      },
      permissions: {
        contents: JobPermission.READ,
        ...(this.authProvider.authProviderType === "GITHUB_OIDC"
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
