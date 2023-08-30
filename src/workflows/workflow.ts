import { Component } from "projen";
import { GitHub, GithubWorkflow } from "projen/lib/github";
import { TypeScriptProject } from "projen/lib/typescript";
import { BuildJob } from "./jobs/build-job";
import { DeployJob, DeployJobOptions } from "./jobs/deploy-job";
import { WorkflowJob } from "./jobs/workflow-job";

/**
 * Name of the permission back up file to include in the build artifact
 * to work around a GitHub Action bug that does not preserve file mode
 * permissions across upload and download actions.
 *
 * See {@link https://github.com/actions/upload-artifact/issues/38}
 */
export const PERMISSION_BACKUP_FILE = "permissions-backup.acl";

export interface WorkflowOptions {
  /**
   * Name of the file (e.g. "deploy" becomes "deploy.yml").
   *
   * @default workflow
   */
  readonly name?: string;

  /**
   * The node version to use in workflows.
   *
   * @default latest
   */
  readonly nodeVersion?: string;

  /**
   * Enable Node.js package cache in GitHub workflows.
   *
   * @default true
   */
  readonly packageCache?: boolean;

  /**
   * The version of PNPM to use if using PNPM as a package manager.
   *
   * @default "8"
   */
  readonly pnpmVersion?: string;

  /**
   * Automatically update files modified during builds to pull-request branches.
   * This means that any files synthesized by projen or e.g. test snapshots will
   * always be up-to-date before a PR is merged.
   *
   * Implies that PR builds do not have anti-tamper checks.
   *
   * This is enabled by default only if `githubTokenSecret` is set. Otherwise it
   * is disabled, which implies that file changes that happen during build will
   * not be pushed back to the branch.
   *
   * @default false
   */
  readonly mutableBuild?: boolean;

  /**
   * What runners should this workflow use by default?
   *
   * @default ["ubuntu-latest"]
   */
  readonly defaultRunners?: Array<string>;
}

export class Workflow extends Component {
  /**
   * Name of the file (e.g. "deploy" becomes "deploy.yml").
   */
  public readonly name: string;

  /**
   * The node version to use in workflows.
   *
   * @default latest
   */
  public readonly nodeVersion: string;

  /**
   * Enable Node.js package cache in GitHub workflows.
   *
   * @default true
   */
  public readonly packageCache: boolean;

  /**
   * Branch or tag name.
   * @default - the default branch is implicitly used
   */
  public readonly ref?: string;

  /**
   * The repository (owner/repo) to use.
   * @default - the default repository is implicitly used
   */
  public readonly repository?: string;

  /**
   * Whether to download files from Git LFS for this workflow
   *
   * @default - Use the setting on the corresponding GitHub project
   */
  public readonly downloadLfs?: boolean;

  /**
   * The version of PNPM to use if using PNPM as a package manager.
   *
   * @default "8"
   */
  public readonly pnpmVersion: string;

  /**
   * Automatically update files modified during builds to pull-request branches.
   * This means that any files synthesized by projen or e.g. test snapshots will
   * always be up-to-date before a PR is merged.
   *
   * Implies that PR builds do not have anti-tamper checks.
   *
   * This is enabled by default only if `githubTokenSecret` is set. Otherwise it
   * is disabled, which implies that file changes that happen during build will
   * not be pushed back to the branch.
   *
   * @default false
   */
  readonly mutableBuild: boolean;

  /**
   * What runners should this workflow use by default?
   *
   * @default ["ubuntu-latest"]
   */
  readonly defaultRunners: Array<string>;

  /**
   * Instance of github configuration for the project
   */
  public readonly github: GitHub;

  /**
   * Github workflow Workflow
   */
  public readonly workflow: GithubWorkflow;

  /**
   * Build Job for the workflow.
   */
  public readonly buildJob: BuildJob;

  /**
   * Other Jobs in this workflow
   */
  public readonly otherJobs: Array<WorkflowJob> = [];

  constructor(
    public readonly project: TypeScriptProject,
    options: WorkflowOptions
  ) {
    super(project);

    const github = GitHub.of(project);

    if (!github) {
      throw new Error(
        "Workflows are currently only supported for GitHub projects"
      );
    }

    // defaults
    this.name = options.name ?? "workflow";
    this.nodeVersion = options.nodeVersion ?? "latest";
    this.packageCache = options.packageCache ?? true;
    this.pnpmVersion = options.pnpmVersion ?? "8";
    this.mutableBuild = options.mutableBuild ?? false;
    this.defaultRunners = options.defaultRunners ?? ["ubuntu-latest"];

    // local
    this.github = github;
    this.workflow = new GithubWorkflow(github, this.name);

    // render the build steps
    this.buildJob = new BuildJob(this);
  }

  addDeployJob(options: DeployJobOptions): DeployJob {
    const job = new DeployJob(this, { ...options });
    this.otherJobs.push(job);
    return job;
  }

  preSynthesize(): void {
    // add the build job to the workflow
    this.workflow.addJob(this.buildJob.jobId, this.buildJob.render());
    // add other jobs
    this.otherJobs.forEach((job) => {
      this.workflow.addJob(job.jobId, job.render());
    });
  }
}
