import { Component } from "projen";
import { BuildWorkflow } from "projen/lib/build";
import { Job, JobPermission } from "projen/lib/github/workflows-model";
import { ServiceDeployTarget } from "./service-deploy-target";
import { FractureService } from "../core";
import { Fracture } from "../core/fracture";

export interface PipelineOptions {
  /**
   * Branch that triggers this pipeline.
   */
  branchName: string;
}

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
  public readonly jobs: Job[] = [];
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
    this.name = `deploy-${this.branchName}`;
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

  preSynthesize(): void {
    super.preSynthesize();

    const fracture = this.project as Fracture;

    // make sure we copy the cdk files over for each service.
    FractureService.all(fracture).forEach((service) => {
      this.workflow.addPostBuildSteps({
        name: `Copy Service to Dist (${service.name})`,
        run: `mkdir -p ${service.cdkOutDistDir} && cp -r ${service.cdkOutBuildDir}/* ${service.cdkOutDistDir}`,
      });
    });

    // add deploy jobs to pipeline
    ServiceDeployTarget.byPipeline(fracture, this).forEach((sdt) => {
      this.workflow.addPostBuildJob(sdt.deployJobName, {
        needs: sdt.needs,
        runsOn: ["ubuntu-latest"],
        permissions: {
          contents: JobPermission.READ,
        },
        steps: [
          {
            name: "Deploy",
            run: `npx aws-cdk@${sdt.service.cdkDeps.cdkVersion} deploy --no-rollback --app ${sdt.service.cdkOutDistDir} ${sdt.stackPattern}`,
          },
        ],
      });
    });
  }
}
