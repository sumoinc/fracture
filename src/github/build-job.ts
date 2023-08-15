import { Component } from "projen";
import {
  Job,
  JobCallingReusableWorkflow,
  JobPermission,
  JobStep,
} from "projen/lib/github/workflows-model";
import { Fracture } from "../core";

export interface BuildJobOptions {
  /**
   * Job ID for the build job.
   *
   * @default build
   */
  jobId?: string;
  /**
   * How the pipleine will refer to the pull request's head ref in git.
   *
   * @default "${{ github.event.pull_request.head.ref }}""
   */
  pullRequestRef?: string;
  /**
   * How the pipleine will refer to the pull request's repository in git.
   *
   * @default "${{ github.event.pull_request.head.repo.full_name }}""
   */
  pullRequestRepository?: string;
  /**
   * Whether downloading from LFS is enabled for this GitHub project
   *
   * @default false
   */
  downloadLfs?: boolean;
  /**
   * The command to run to build the project.
   *
   * @default "npx projen build"
   */
  buildCommand?: string;
  /**
   * Steps to run before the build command is executed.
   *
   * @default []
   */
  preBuildSteps?: JobStep[];
  /**
   * Steps to run before the build command is executed.
   *
   * @default []
   */
  postBuildSteps?: JobStep[];
  /**
   * The command to run to synth the project.
   *
   * @default "npx projen synth"
   */
  synthCommand?: string;
  /**
   * Steps to run before the synth command is executed.
   *
   * @default []
   */
  preSynthSteps?: JobStep[];
  /**
   * Steps to run before the synth command is executed.
   *
   * @default []
   */
  postSynthSteps?: JobStep[];
}

export class BuildJob extends Component {
  /**
   * The job definition, suitable for adding to a workflow.
   */
  public readonly job: Job | JobCallingReusableWorkflow;
  /**
   * The Job Id for the build job
   *
   * @default build
   */
  public readonly jobId: string;
  /**
   * How the pipleine will refer to the pull request's head ref in git.
   *
   * @default "${{ github.event.pull_request.head.ref }}""
   */
  public readonly pullRequestRef: string;
  /**
   * How the pipleine will refer to the pull request's repository in git.
   *
   * @default "${{ github.event.pull_request.head.repo.full_name }}""
   */
  public readonly pullRequestRepository: string;
  /**
   * Whether downloading from LFS is enabled for this GitHub project
   *
   * @default false
   */
  public readonly downloadLfs: boolean;

  /**
   * The command to run to build the project.
   *
   * @default "npx projen build"
   */
  public readonly buildCommand: string;
  /**
   * Steps to run before the build command is executed.
   *
   * @default []
   */
  public readonly preBuildSteps?: JobStep[];
  /**
   * Steps to run before the build command is executed.
   *
   * @default []
   */
  public readonly postBuildSteps?: JobStep[];
  /**
   * The command to run to synth the project.
   *
   * @default "npx projen synth"
   */
  public readonly synthCommand?: string;
  /**
   * Steps to run before the synth command is executed.
   *
   * @default []
   */
  public readonly preSynthSteps?: JobStep[];
  /**
   * Steps to run before the synth command is executed.
   *
   * @default []
   */
  public readonly postSynthSteps?: JobStep[];

  constructor(fracture: Fracture, options: BuildJobOptions = {}) {
    super(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.jobId = options.jobId ?? "build";
    this.pullRequestRef =
      options.pullRequestRef ?? "${{ github.event.pull_request.head.ref }}";
    this.pullRequestRepository =
      options.pullRequestRepository ??
      "${{ github.event.pull_request.head.repo.full_name }}";
    this.downloadLfs = options.downloadLfs ?? false;
    this.buildCommand = options.buildCommand ?? "npx projen build";
    this.preBuildSteps = options.preBuildSteps ?? [];
    this.postBuildSteps = options.postBuildSteps ?? [];
    this.synthCommand = options.synthCommand ?? "npx projen synth";
    this.preSynthSteps = options.preSynthSteps ?? [];
    this.postSynthSteps = options.postSynthSteps ?? [];

    /***************************************************************************
     * Create job definition
     **************************************************************************/

    this.job = {
      runsOn: ["ubuntu-latest"],
      env: {
        CI: "true",
      },
      permissions: {
        contents: JobPermission.WRITE,
      },
      steps: [
        {
          name: "Checkout",
          uses: "actions/checkout@v3",
          with: {
            ref: this.pullRequestRef,
            repository: this.pullRequestRepository,
            ...(this.downloadLfs ? { lfs: true } : {}),
          },
        },
        ...fracture.renderWorkflowSetup({
          mutable: true,
        }),

        ...this.preBuildSteps,
        {
          name: "Build",
          run: this.buildCommand,
        },
        ...this.postBuildSteps,

        ...this.preSynthSteps,
        {
          name: "Synth",
          run: this.synthCommand,
        },
        ...this.postSynthSteps,
      ],
    };
  }
}
