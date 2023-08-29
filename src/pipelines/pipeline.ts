import { Component } from "projen";
import { BuildWorkflow } from "projen/lib/build";
import { Job } from "projen/lib/github/workflows-model";
import { NodeProject } from "projen/lib/javascript";

export interface PipelineOptions {
  /**
   * Branch that triggers this pipeline.
   */
  branchName: string;
  /**
   * What paths should trigger this pipeline?
   *
   * @default [] (all)
   */
  paths?: string[];
}

export class Pipeline extends Component {
  /**
   * Returns a environment by name, or undefined if it doesn't exist
   */
  public static byBranchName(
    project: NodeProject,
    branchName: string
  ): Pipeline | undefined {
    const isDefined = (c: Component): c is Pipeline =>
      c instanceof Pipeline && c.branchName === branchName;
    return project.components.find(isDefined);
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
  public readonly paths: string[];
  /**
   * All jobs for this pipeline.
   */
  public readonly jobs: Job[] = [];
  /**
   * Pipeline workflow
   */
  public readonly workflow: BuildWorkflow;

  constructor(project: NodeProject, options: PipelineOptions) {
    /***************************************************************************
     * Check Duplicates
     **************************************************************************/

    const branchName = options.branchName;

    if (Pipeline.byBranchName(project, branchName)) {
      throw new Error(
        `Duplicate deployment pipeline for branch name "${branchName}".`
      );
    }

    super(project);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.branchName = options.branchName;
    this.name = `deploy-${this.branchName}`;
    this.branchTriggerPatterns = [this.branchName];
    this.paths = options.paths ?? [];

    /*************************************************************************
     * Create initial workflow
     ************************************************************************/

    const workflowTriggers = {
      push: {
        branches: this.branchTriggerPatterns,
        paths: this.paths,
      },
      workflowDispatch: {}, // allow manual triggering
    };

    const workFlowSetup = project.renderWorkflowSetup({
      mutable: false,
    });

    this.workflow = new BuildWorkflow(project, {
      name: this.name,
      buildTask: project.buildTask,
      artifactsDirectory: project.artifactsDirectory,
      mutableBuild: false,
      workflowTriggers,
      preBuildSteps: workFlowSetup,
    });
  }

  preSynthesize(): void {
    super.preSynthesize();

    //const fracture = this.project as Fracture;

    // make sure we copy the cdk files over for each service.
    /*
    FractureService.all(fracture).forEach((service) => {
      this.workflow.addPostBuildSteps({
        name: `Copy Service to Dist (${service.name})`,
        run: `mkdir -p ${service.cdkOutDistDir} && cp -r ${service.cdkOutBuildDir}/* ${service.cdkOutDistDir}`,
      });
    });
    */
    // add deploy jobs to pipeline
    /*
    ServiceDeployTarget.byPipeline(this).forEach((sdt) => {
      this.workflow.addPostBuildJob(sdt.deployJobName, {
        needs: sdt.needs,
        runsOn: ["ubuntu-latest"],
        permissions: {
          contents: JobPermission.READ,
          idToken: JobPermission.WRITE,
        },
        steps: [
          {
            name: "Configure AWS Credentials",
            uses: "aws-actions/configure-aws-credentials@v2",
            with: {
              "role-to-assume": `arn:aws:iam::${sdt.environment.accountNumber}:role/GitHubDeploymentOIDCRole`,
              "aws-region": sdt.environment.region,
            },
          },
          {
            name: "Deploy",
            run: `npx aws-cdk@${sdt.service.cdkDeps.cdkVersion} deploy --no-rollback --app ${sdt.service.cdkOutDistDir} ${sdt.stackPattern}`,
          },
        ],
      });
    });
    */
  }
}
