import { paramCase } from "change-case";
import { Job, JobPermission, JobStep } from "projen/lib/github/workflows-model";
import { TypeScriptProject } from "projen/lib/typescript";
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
   * How to identify the app being deployed
   *
   */
  readonly appName: string;

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

  /**
   * Directory that was preserved for this project in order to deploy
   * properly in deploy step.
   */
  readonly artifactsDirectory: string;
}

export class DeployJob extends WorkflowJob {
  /**
   * The branch pattern this deployment is targeting.
   *
   * @default main
   */
  public readonly branchPrefix: string;

  /**
   * Jobs that must complete before this one may run
   *
   * @default - the build job
   */
  public readonly needs: Array<string>;

  /**
   * Step definition(s) that conduct the deployment
   */
  public readonly deploySteps: Array<JobStep>;

  /**
   * Environment deploying to.
   */
  public readonly environment: Environment;

  /**
   * Directory that was preserved for this project in order to deploy
   * properly in deploy step.
   */
  public readonly artifactsDirectory: string;

  /**
   * Workflow for deployment
   */
  readonly workflow: Workflow;

  constructor(
    public readonly project: TypeScriptProject,
    options: DeployJobOptions
  ) {
    const branchPrefix = options.branchPrefix ?? "main";
    const name = `Deploy ${options.appName} to ${options.environment.name}`;
    const jobId = options.jobId ?? paramCase(name);

    super(project, {
      jobId,
      name,
      ...options,
    });

    // defaults
    this.workflow = Workflow.deploy(project);
    this.branchPrefix = branchPrefix;
    this.needs = [this.workflow.buildJob.jobId, ...(options.needs ?? [])];
    this.deploySteps = options.deploySteps;
    this.environment = options.environment;
    this.artifactsDirectory = options.artifactsDirectory;

    // add this branch pattern as a trigger for the workflow
    this.workflow.addPushTrigger(this.branchPrefix);

    // make sure build step will store the artifacts we need
    this.workflow.buildJob.artifactDirectories.push(this.artifactsDirectory);
  }

  dependsOn = (job: WorkflowJob): void => {
    this.needs.push(job.jobId);
  };

  render = (): Job => {
    return {
      name: this.name,
      runsOn: this.workflow.defaultRunners,
      needs: this.needs,
      concurrency: this.jobId,
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
        ...renderSetupNodeSteps(this.workflow, {
          packageCache: false,
          setupPnpm: false,
        }),
        ...renderDeploySteps(this),
      ],
    };
  };
}
