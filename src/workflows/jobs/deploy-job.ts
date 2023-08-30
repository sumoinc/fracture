import { paramCase } from "change-case";
import { Task } from "projen";
import { Job, JobPermission } from "projen/lib/github/workflows-model";
import { SetOptional, ValueOf } from "type-fest";
import { WorkflowJob, WorkflowJobOptions } from "./workflow-job";
import { REGION_IDENTITIER } from "../../core";
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
  readonly branchPattern?: string;

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
   * AWS OIDC Credentials, if deploying to AWS
   */
  readonly awsOidcCredentials?: {
    roleToAssume: string;
    awsRegion: ValueOf<typeof REGION_IDENTITIER>;
    roleDurationSeconds: number;
  };
}

export class DeployJob extends WorkflowJob {
  /**
   * The branch pattern this deployment is targeting.
   *
   * @default main
   */
  readonly branchPattern: string;

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
   * AWS OIDC Credentials, if deploying to AWS
   */
  readonly awsOidcCredentials?: {
    roleToAssume: string;
    awsRegion: ValueOf<typeof REGION_IDENTITIER>;
    roleDurationSeconds: number;
  };

  constructor(public readonly workflow: Workflow, options: DeployJobOptions) {
    const branchPattern = options.branchPattern ?? "main";
    const name = options.name ?? `Deploy ${branchPattern}`;
    const jobId = options.jobId ?? paramCase(name);

    super(workflow, {
      jobId,
      name,
      ...options,
    });

    // defaults
    this.branchPattern = branchPattern;
    this.needs = [workflow.buildJob.jobId, ...(options.needs ?? [])];
    this.deployTask = options.deployTask;
    this.awsOidcCredentials = options.awsOidcCredentials;

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
      if: `startsWith( github.ref, 'refs/heads/${this.branchPattern}' )`,
      env: {
        CI: "true",
      },
      permissions: {
        contents: JobPermission.READ,
        ...(this.awsOidcCredentials
          ? {
              idToken: JobPermission.WRITE,
            }
          : {}),
      },
      steps: [
        ...renderDownloadArtifactSteps(this),
        ...renderSetupNodeSteps(this.workflow),
        ...renderDeploySteps(this),
      ],
    };
  };
}
