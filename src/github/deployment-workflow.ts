import { Component } from "projen";
import { GitHub, GithubWorkflow } from "projen/lib/github";
import { BuildJob } from "./build-job";
import { DeployJob } from "./deploy-job";
import { Fracture, Pipeline } from "../core";

export interface DeploymentWorkflowOptions {
  /**
   * The name of the workflow.
   *
   * @default "deployment"
   */
  name?: string;
  /**
   * Storage location for this workflow.
   *
   * @default ".github/workflows/{this.name}.yml"
   */
  filePath?: string;
  /**
   * the pipeline defnition being used for this workflow
   */
  pipeline: Pipeline;
}

export class DeploymentWorkflow extends Component {
  private readonly githubWorkflow: GithubWorkflow;
  /**
   * The name of the workflow.
   *
   * @default "deployment"
   */
  public readonly name: string;
  /**
   * Storage location for this workflow.
   *
   * @default ".github/workflows/{this.name}.yml"
   */
  public readonly filePath: string;

  constructor(fracture: Fracture, options: DeploymentWorkflowOptions) {
    super(fracture);

    const github = GitHub.of(fracture);
    if (!github) {
      throw new Error(
        "DeploymentWorkflow is currently only supported for GitHub projects"
      );
    }

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = options.name ?? "deployment";
    this.filePath = options.filePath ?? `.github/workflows/${this.name}.yml`;
    const { pipeline } = options;

    /***************************************************************************
     * Workflow definition
     **************************************************************************/

    this.githubWorkflow = new GithubWorkflow(github, this.name);

    /**
     * Trigger on push when any of the files in the app or it's component
     * services are modified.
     */
    this.githubWorkflow.on({
      push: {
        branches: pipeline.branchTriggerPatterns,
        paths: [pipeline.app.appRoot].concat(
          pipeline.app.services.map((s) => s.serviceRoot)
        ),
      },
      workflowDispatch: {}, // allow manual triggering
    });

    // build all deployment artifacts
    const buildJob = new BuildJob(fracture);
    this.githubWorkflow.addJob(buildJob.jobId, buildJob.job);

    // add deployment waves to workflow
    pipeline.waves.forEach((wave) => {
      wave.stages.forEach(() => {
        const deployJob = new DeployJob(pipeline.project as Fracture);
        this.githubWorkflow.addJob(deployJob.jobId, deployJob.job);
        //console.log(wave.name, stage.name);
        //this.addDeployJob(stage);
      });
    });
  }
}
