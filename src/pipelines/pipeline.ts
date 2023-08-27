import { Component } from "projen";
import { BuildWorkflow } from "projen/lib/build";
import { Job, JobPermission, JobStep } from "projen/lib/github/workflows-model";
import { SetRequired } from "type-fest";
import { Fracture } from "../core/fracture";

export interface PipelineOptions {
  /**
   * Branch that triggers this pipeline.
   */
  branchName: string;
}

export type PipelineJob = SetRequired<Partial<Job>, "name"> & {
  steps: PipelineStep[];
};
export type PipelineStep = SetRequired<Partial<JobStep>, "name">;

export class Pipeline extends Component {
  /**
   * Returns a environment by name, or undefined if it doesn't exist
   */
  public static byBranchName(
    fracture: Fracture,
    branchName: string
  ): Pipeline | undefined {
    const isDefined = (c: Component): c is Pipeline =>
      c instanceof Pipeline && c.branchName === branchName;
    return fracture.components.find(isDefined);
  }
  /**
   * Branch that triggers this pipeline.
   */
  public readonly branchName: string;
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
  public readonly pathTriggerPatterns: string[] = [];
  /**
   * All jobs for this pipeline.
   */
  public readonly jobs: PipelineJob[] = [];
  /**
   * Pipeline workflow
   */
  public readonly workflow: BuildWorkflow;

  constructor(fracture: Fracture, options: PipelineOptions) {
    /***************************************************************************
     * Check Duplicates
     **************************************************************************/

    const branchName = options.branchName;

    if (Pipeline.byBranchName(fracture, branchName)) {
      throw new Error(`Duplicate pipeline for branch name "${branchName}".`);
    }

    super(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.branchName = options.branchName;
    this.name = `deploy-${this.branchName}}`;
    this.branchTriggerPatterns =
      options.branchName === fracture.defaultReleaseBranch
        ? [options.branchName]
        : [`${options.branchName}/*`];

    /*************************************************************************
     * Create initial workflow
     ************************************************************************/

    const workflowTriggers = {
      push: {
        branches: this.branchTriggerPatterns,
        paths: this.pathTriggerPatterns,
      },
      workflowDispatch: {}, // allow manual triggering
    };

    const workFlowSetup = fracture.renderWorkflowSetup({
      mutable: false,
    });

    this.workflow = new BuildWorkflow(fracture, {
      name: this.name,
      buildTask: fracture.buildTask,
      artifactsDirectory: fracture.artifactsDirectory,
      mutableBuild: false,
      workflowTriggers,
      preBuildSteps: workFlowSetup,
    });
  }

  addPostBuildJob(job: PipelineJob): void {
    this.workflow.addPostBuildJob(job.name, {
      runsOn: ["ubuntu-latest"],
      steps: job.steps,
      permissions: {
        contents: JobPermission.READ,
      },
    });
  }

  addPostBuildStep(step: PipelineStep): void {
    this.workflow.addPostBuildSteps(step);
  }

  preSynthesize(): void {
    const fracture = this.project as Fracture;

    /*************************************************************************
     * Post build steps
     ************************************************************************/

    // move outputs to the dist folder so they can be saved as one big artifact
    fracture.services.forEach((service) => {
      this.workflow.addPostBuildSteps({
        name: `Copy Service to Dist (${service.name})`,
        run: `mkdir -p ${service.cdkOutDistDir} && cp -r ${service.cdkOutBuildDir}/* ${service.cdkOutDistDir}`,
      });
    });
  }
}
