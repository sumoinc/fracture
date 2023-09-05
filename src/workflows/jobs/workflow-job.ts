import { Component } from "projen";
import { Job } from "projen/lib/github/workflows-model";
import { NodeProject } from "projen/lib/javascript";

export interface WorkflowJobOptions {
  /**
   * Job's Id
   */
  readonly jobId: string;
  /**
   * Job's name
   */
  readonly name: string;
}

export class WorkflowJob extends Component {
  /**
   * Build Job's Id for this workflow.
   */
  public readonly jobId: string;
  /**
   * Job's name
   */
  public readonly name: string;

  constructor(
    public readonly project: NodeProject,
    options: WorkflowJobOptions
  ) {
    super(project);

    //defaults
    this.jobId = options.jobId;
    this.name = options.name;
  }

  render = (): Job => {
    throw new Error("Not Implemented");
  };
}
