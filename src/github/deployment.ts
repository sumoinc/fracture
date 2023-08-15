import { paramCase } from "change-case";
import { Component } from "projen";
import { GitHub, GithubWorkflow } from "projen/lib/github";
import { BuildJob } from "./build-job";
import { DeployJob } from "./deploy-job";
import { Fracture, Pipeline } from "../core";
import { TurboRepo } from "../turborepo";

export interface DeploymentOptions {
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

export class Deployment extends Component {
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

  constructor(fracture: Fracture, options: DeploymentOptions) {
    super(fracture);

    /***************************************************************************
     * LOCALS
     **************************************************************************/

    const github = GitHub.of(fracture);
    if (!github) {
      throw new Error(
        "Deployment is currently only supported for GitHub enabled projects"
      );
    }

    const turboRepo = TurboRepo.of(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = options.name ? paramCase(options.name) : "deployment";
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
        paths: [],
        /*
        paths: [pipeline.app.appRoot].concat(
          pipeline.app.services.map((s) => s.serviceRoot)
        ),
        */
      },
      workflowDispatch: {}, // allow manual triggering
    });

    /***************************************************************************
     *
     * BUILD JOB
     *
     * Can leverage turbo-repo if it's available.
     *
     **************************************************************************/

    const buildJob = !turboRepo
      ? new BuildJob(fracture)
      : new BuildJob(fracture, {
          buildCommand: fracture.runTaskCommand(turboRepo.buildTask),
          postBuildSteps: [
            {
              name: "Synth",
              run: fracture.runTaskCommand(turboRepo.synthTask),
            },
          ],
        });

    this.githubWorkflow.addJob(buildJob.jobId, buildJob.job);

    /***************************************************************************
     *
     * DEPLOY JOBS
     *
     **************************************************************************/

    // no waves, just use default workflow
    if (pipeline.waves.length === 0) {
      const deployJob = !turboRepo
        ? new DeployJob(fracture)
        : new DeployJob(fracture, {
            deployCommand: fracture.runTaskCommand(turboRepo.deployTask),
          });
      this.githubWorkflow.addJob(deployJob.jobId, deployJob.job);
    }

    // add deployment waves to workflow
    if (pipeline.waves.length > 0) {
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
}
