import { Component } from "projen";
import { GitHub, GithubWorkflow } from "projen/lib/github";
import { Fracture } from "./fracture";
import { Pipeline } from "./pipeline";

// const BUILD_JOBID = "build";
// const DEPLOY_JOBID_PREFIX = "deploy";
export const DEPLOY_TASK_PREFIX = "cdk:deploy";

export interface PipelineWorkflowOptions {
  pipeline: Pipeline;
}

export class PipelineWorkflow extends Component {
  // all other options
  public readonly options: PipelineWorkflowOptions;

  /**
   * Because the github workflow is build on the base project we pass in the app
   * but the component is actually based the root project
   */
  constructor(fracture: Fracture, options: PipelineWorkflowOptions) {
    super(fracture);

    this.options = options;

    // debugging output
    this.project.logger.info(
      `INIT Pipeline Workflow: "${this.pipeline.deployName}"`
    );
  }

  public get pipeline() {
    return this.options.pipeline;
  }

  preSynthesize(): void {
    const fracture = this.project as Fracture;
    const pipeline = this.pipeline;
    const app = pipeline.app;

    /*******************************************************************************
     *
     * TASK CONFIGURATION
     *
     * Adds a task to projen for each deployment stage.
     *
     ******************************************************************************/

    pipeline.stages.forEach((stage) => {
      fracture.addTask(`${DEPLOY_TASK_PREFIX}:${stage.id}`, {
        description: `CDK deploy of ${stage.name} stage`,
        exec: `cdk deploy *-${stage.id} --require-approval never`,
      });
    });

    /*******************************************************************************
     *
     * WORKFLOW CONFIGURATION
     *
     * Builds github workflow for stages created in tasks above.
     *
     ******************************************************************************/

    console.log(`DEBUG: "${pipeline.deployName}"`, fracture.name, app.name);

    const github = GitHub.of(fracture);
    if (!github) {
      throw new Error("Pipeline requires a github project");
    }

    new GithubWorkflow(github, pipeline.deployName);

    // build code

    // new BuildWorkflow(project, {
    //   name: "deploy",
    //   buildTask: project.buildTask,
    //   artifactsDirectory: project.artifactsDirectory,
    // containerImage: options.workflowContainerImage,
    // gitIdentity: this.workflowGitIdentity,
    // mutableBuild: options.mutableBuild,
    // preBuildSteps: this.renderWorkflowSetup({
    //   mutable: options.mutableBuild ?? true,
    // }),
    // postBuildSteps: options.postBuildSteps,
    // runsOn: options.workflowRunsOn,
    // workflowTriggers: options.buildWorkflowTriggers,
    // permissions: workflowPermissions,
    // });
  }
}
