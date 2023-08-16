import { Component } from "projen";
import { BuildWorkflow } from "projen/lib/build";
import { GitHub } from "projen/lib/github";
import { Job, JobPermission } from "projen/lib/github/workflows-model";
import { Fracture } from "../core/fracture";
import { TurboRepo } from "../turborepo";

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

export class Pipeline extends Component {
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
  public readonly jobs: Job[] = [];

  constructor(fracture: Fracture, options: PipelineOptions) {
    super(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = options.name;
    this.branchTriggerPatterns = options.branchTriggerPatterns;
    this.pathTriggerPatterns = options.pathTriggerPatterns ?? [];
    this.deploy = options.deploy ?? false;
  }

  /*
  addJob(options: JobOptions): Job {
    const job = new Job(this.project as Fracture, options);
    this.jobs.push(job);
    return job;
  }*/

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
    const turborepo = TurboRepo.of(fracture);

    if (github) {
      /*************************************************************************
       * Build
       ************************************************************************/

      const buildTask = turborepo ? turborepo.buildTask : fracture.buildTask;

      const workflowTriggers = {
        push: {
          branches: this.branchTriggerPatterns,
          paths: this.pathTriggerPatterns,
        },
        workflowDispatch: {}, // allow manual triggering
      };

      const postBuildSteps = turborepo
        ? [
            {
              name: turborepo.synthTask.name,
              run: fracture.runTaskCommand(turborepo.synthTask),
            },
          ]
        : [];

      const buildWorkflow = new BuildWorkflow(fracture, {
        name: this.name,
        buildTask,
        artifactsDirectory: fracture.artifactsDirectory,
        // containerImage: options.workflowContainerImage,
        // gitIdentity: this.workflowGitIdentity,
        mutableBuild: false,
        // preBuildSteps: this.renderWorkflowSetup({
        //   mutable: options.mutableBuild ?? true,
        // }),
        postBuildSteps,
        // runsOn: options.workflowRunsOn,
        workflowTriggers,
        // permissions: workflowPermissions,
      });

      /*************************************************************************
       * Deploy
       ************************************************************************/

      const job: Job = {
        runsOn: ["ubuntu-latest"],
        steps: [
          {
            name: "foo",
            run: "bar",
          },
        ],
        permissions: {
          contents: JobPermission.READ,
        },
      };

      buildWorkflow.addPostBuildJob("someid", job);
    }
  }
}
