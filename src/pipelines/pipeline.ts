import { paramCase } from "change-case";
import { Component } from "projen";
import { BuildWorkflow } from "projen/lib/build";
import { Job, JobPermission, JobStep } from "projen/lib/github/workflows-model";
import { SetRequired } from "type-fest";
import { DeployTarget } from "./deploy-target";
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
   * All jobs for this pipeline.
   */
  public readonly jobs: PipelineJob[] = [];
  /**
   * Pipeline workflow
   */
  public readonly workflow: BuildWorkflow;

  constructor(fracture: Fracture, options: PipelineOptions) {
    super(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = paramCase(options.name);
    this.branchTriggerPatterns = options.branchTriggerPatterns;
    this.pathTriggerPatterns = options.pathTriggerPatterns ?? [];

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

  addJob(job: PipelineJob): void {
    this.workflow.addPostBuildJob(job.name, {
      runsOn: ["ubuntu-latest"],
      steps: job.steps,
      permissions: {
        contents: JobPermission.READ,
      },
    });
  }

  addDeployment(deployTarget: DeployTarget): void {
    this.addJob({
      name: `deploy-${deployTarget.name}`,
      permissions: {
        contents: JobPermission.WRITE,
      },
      steps: [
        {
          name: "Deploy",
          run: `npx aws-cdk@${deployTarget.service.cdkDeps.cdkVersion} deploy --no-rollback --app ${deployTarget.service.cdkOutDistDir} ${deployTarget.name}`,
        },
      ],
    });
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
