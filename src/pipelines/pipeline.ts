import { paramCase } from "change-case";
import { Component } from "projen";
import { BuildWorkflow } from "projen/lib/build";
import { GitHub } from "projen/lib/github";
import { Job, JobPermission, JobStep } from "projen/lib/github/workflows-model";
import { SetRequired } from "type-fest";
import { Fracture } from "../core/fracture";

export interface PipelineOptions {
  /**
   * Name for this pipeline.
   */
  name: string;
  /**
   * What branches shoudl trigger this pipeline?
   */
  branchTriggerPatterns: string[];
  /**
   * What paths should trigger this pipeline?
   *
   * @default [] (all)
   */
  pathTriggerPatterns?: string[];
  /**
   * Pipelines always build and synth but don't always deploy.
   * Should this pipeline deploy the app after build?
   *
   * @default false
   */
  deploy?: boolean;
}

export type PipelineJob = SetRequired<Partial<Job>, "name"> & {
  steps: PipelineStep[];
};
export type PipelineStep = SetRequired<Partial<JobStep>, "name">;

export class Pipeline extends Component {
  /**
   * If for this pipeline (suitable as filename)
   */
  public readonly id: string;
  /**
   * Name for this pipeline.
   */
  public readonly name: string;
  /**
   * What branches should trigger this pipeline?
   */
  public readonly branchTriggerPatterns: string[];
  /**
   * What paths should trigger this pipeline?
   *
   * @default [] (all)
   */
  public readonly pathTriggerPatterns: string[];
  /**
   * Pipelines always build and synth but don't always deploy.
   * Should this pipeline deploy the app after build?
   *
   * @default false
   */
  public readonly deploy: boolean;
  /**
   * All jobs for this pipeline.
   */
  public readonly jobs: PipelineJob[] = [];

  constructor(fracture: Fracture, options: PipelineOptions) {
    super(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = options.name;
    this.id = paramCase(this.name);
    this.branchTriggerPatterns = options.branchTriggerPatterns;
    this.pathTriggerPatterns = options.pathTriggerPatterns ?? [];
    this.deploy = options.deploy ?? false;
  }

  addJob(job: PipelineJob): void {
    this.jobs.push(job);
  }

  synthesize(): void {
    const fracture = this.project as Fracture;

    /***************************************************************************
     *
     * Github Workflow
     *
     * this is the only platform currently supported in fracture.
     *
     **************************************************************************/

    const github = GitHub.of(fracture);

    if (github) {
      /*************************************************************************
       * Build
       ************************************************************************/

      const workflowTriggers = {
        push: {
          branches: this.branchTriggerPatterns,
          paths: this.pathTriggerPatterns,
        },
        workflowDispatch: {}, // allow manual triggering
      };

      const buildWorkflow = new BuildWorkflow(fracture, {
        name: this.name,
        buildTask: fracture.buildTask,
        artifactsDirectory: fracture.artifactsDirectory,
        // containerImage: options.workflowContainerImage,
        // gitIdentity: this.workflowGitIdentity,
        mutableBuild: false,
        // preBuildSteps: this.renderWorkflowSetup({
        //   mutable: options.mutableBuild ?? true,
        // }),
        // postBuildSteps,
        // runsOn: options.workflowRunsOn,
        workflowTriggers,
        // permissions: workflowPermissions,
      });

      /*************************************************************************
       * Post build jobs
       ************************************************************************/

      this.jobs.forEach((job) => {
        buildWorkflow.addPostBuildJob(job.name, {
          runsOn: ["ubuntu-latest"],
          steps: job.steps,
          permissions: {
            contents: JobPermission.READ,
          },
        });
      });
    }
  }
}
