import { Component, Project } from "projen";
import { GitHub, GithubWorkflow } from "projen/lib/github";

export interface DeploymentWorkflowOptions {
  /**
   * The name of the workflow.
   */
  name: string;
}

export class DeploymentWorkflow extends Component {
  private readonly github: GitHub;
  private readonly workflow: GithubWorkflow;
  private readonly options: DeploymentWorkflowOptions;

  constructor(project: Project, options: DeploymentWorkflowOptions) {
    super(project);

    const github = GitHub.of(project);
    if (!github) {
      throw new Error(
        "DeploymentWorkflow is currently only supported for GitHub projects"
      );
    }

    this.github = github;
    this.options = options;

    this.workflow = new GithubWorkflow(github, this.name);
    this.workflow.on({
      pullRequest: {},
      workflowDispatch: {}, // allow manual triggering
    });
  }

  public get name() {
    return this.options.name;
  }
}
