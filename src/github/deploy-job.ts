import { Component } from "projen";
import {
  Job,
  JobCallingReusableWorkflow,
  JobPermission,
} from "projen/lib/github/workflows-model";
import { Fracture } from "../core";

export interface DeployJobOptions {
  /**
   * Job ID for the deploy job.
   *
   * @default deploy
   */
  jobId: string;
  /**
   * The command to run to deploy the code.
   *
   * @default "npx projen deploy"
   */
  deployCommand: string;
}

export class DeployJob extends Component {
  /**
   * The job definition, suitable for adding to a workflow.
   */
  public readonly job: Job | JobCallingReusableWorkflow;
  /**
   * The Job Id for the deploy job
   *
   * @default deploy
   */
  public readonly jobId: string;
  /**
   * The command to run to deploy the code.
   *
   * @default "npx projen deploy"
   */
  public readonly deployCommand: string;

  constructor(fracture: Fracture, options: Partial<DeployJobOptions> = {}) {
    super(fracture);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.jobId = options.jobId ?? "deploy";
    this.deployCommand = options.deployCommand ?? "npx projen deploy";

    /***************************************************************************
     * Create job definition
     **************************************************************************/

    this.job = {
      runsOn: ["ubuntu-latest"],
      env: {
        CI: "true",
      },
      permissions: {
        contents: JobPermission.WRITE,
      },
      steps: [
        {
          name: "Deploy",
          run: this.deployCommand,
        },
      ],
    };
  }
}
