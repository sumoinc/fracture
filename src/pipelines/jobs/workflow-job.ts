import { Component } from "projen";
import { Job } from "projen/lib/github/workflows-model";
import { Workflow } from "../workflow";

export interface WorkflowJobOptions {
  /**
   * Job's Id
   */
  readonly jobId: string;
  /**
   * Job's name
   */
  readonly name: string;
  /**
   * Names of a directories that include build artifacts.
   */
  readonly artifactDirectories?: Array<string>;
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

  /**
   * Names of a directories that include build artifacts.
   */
  readonly artifactDirectories: Array<string>;

  constructor(public readonly workflow: Workflow, options: WorkflowJobOptions) {
    super(workflow.project);

    //defaults
    this.jobId = options.jobId;
    this.name = options.name;
    this.artifactDirectories = options.artifactDirectories ?? [];
  }

  render = (): Job => {
    throw new Error("Not Implemented");
  };
}
