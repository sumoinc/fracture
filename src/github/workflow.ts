import { paramCase } from "change-case";
import {
  GitHub,
  GithubWorkflow,
  GithubWorkflowOptions,
} from "projen/lib/github";
import { BuildJob } from "./build-job";
import { Fracture } from "../core";
import { TurboRepo } from "../turborepo";

export interface GithubFractureWorkflowOptions extends GithubWorkflowOptions {
  /**
   * The name of the workflow.
   */
  name: string;
  /**
   * What branches shoudl trigger this pipeline?
   */
  branchTriggerPatterns: string[];
  /**
   * What paths should trigger this pipeline?
   */
  pathTriggerPatterns: string[];
  /**
   * Pipelines always builds but don't always deploy.
   * Should this pipeline deploy the app after build?
   */
  deploy: boolean;
}

export class GithubFractureWorkflow extends GithubWorkflow {
  /**
   * The name of the workflow.
   */
  public readonly name: string;
  /**
   * Storage location for this workflow.
   */
  public readonly filePath: string;

  constructor(fracture: Fracture, options: GithubFractureWorkflowOptions) {
    /***************************************************************************
     * Super
     **************************************************************************/

    const github = GitHub.of(fracture);
    if (!github) {
      throw new Error(
        "Fracture workflows are currently only supported for GitHub enabled projects"
      );
    }
    const name = options.name ? paramCase(options.name) : "deployment";
    super(github, name, options);

    /***************************************************************************
     * Locals
     **************************************************************************/

    const turboRepo = TurboRepo.of(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = name;
    this.filePath = `.github/workflows/${this.name}.yml`;

    /***************************************************************************
     * Triggers
     **************************************************************************/

    this.on({
      push: {
        branches: options.branchTriggerPatterns,
        paths: options.pathTriggerPatterns,
      },
      workflowDispatch: {}, // allow manual triggering
    });

    /***************************************************************************
     *
     * BUILD JOB
     *
     * Leverage turbo-repo commands, if available.
     *
     **************************************************************************/

    const buildJob = !turboRepo
      ? new BuildJob(fracture)
      : new BuildJob(fracture, {
          buildCommand: fracture.runTaskCommand(turboRepo.buildTask),
          synthCommand: fracture.runTaskCommand(turboRepo.synthTask),
        });
    this.addJob(buildJob.jobId, buildJob.job);

    /***************************************************************************
     *
     * DEPLOY JOBS
     *
     **************************************************************************/

    // no waves, just use default workflow
    /*
    if (pipeline.waves.length === 0) {
      const deployJob = !turboRepo
        ? new DeployJob(fracture)
        : new DeployJob(fracture, {
            deployCommand: fracture.runTaskCommand(turboRepo.deployTask),
          });
      this.githubWorkflow.addJob(deployJob.jobId, deployJob.job);
    }*/

    // add deployment waves to workflow
    /*
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
    */
  }
}
