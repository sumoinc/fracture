import { Component } from "projen";
import { GitHub, GithubWorkflow } from "projen/lib/github";
import { Job, JobPermission, JobStep } from "projen/lib/github/workflows-model";
import { NodeProject } from "projen/lib/javascript";

const BUILD_JOBID = "build";

export interface DeploymentWorkflowOptions {
  /**
   * Name of the file (e.g. "deploy" becomes "deploy.yml").
   *
   * @default "deploy"
   */
  name?: string;

  workflowNodeVersion?: string;
  pnpmVersion?: string;
  mutableBuild?: boolean;
}

export class DeploymentWorkflow extends Component {
  /**
   * Returns a environment by name, or undefined if it doesn't exist
   */
  public static of(project: NodeProject): DeploymentWorkflow | undefined {
    const isDefined = (c: Component): c is DeploymentWorkflow =>
      c instanceof DeploymentWorkflow;
    return project.components.find(isDefined);
  }
  /**
   * Name of the file (e.g. "deploy" becomes "deploy.yml").
   *
   * @default "deploy"
   */
  readonly name: string;
  /**
   * Deployment Workflow
   */
  public readonly workflow: GithubWorkflow;
  private readonly github: GitHub;
  private readonly defaultRunners: string[] = ["ubuntu-latest"];
  private readonly workflowNodeVersion: string;
  private readonly pnpmVersion: string;
  private readonly mutableBuild: boolean;

  constructor(project: NodeProject, options: DeploymentWorkflowOptions) {
    super(project);

    const github = GitHub.of(project);

    if (!github) {
      throw new Error(
        "BuildWorkflow is currently only supported for GitHub projects"
      );
    }

    this.name = options.name ?? "deploy";
    this.workflow = new GithubWorkflow(github, this.name);
    this.github = github;
    this.workflowNodeVersion = options.workflowNodeVersion ?? "18";
    this.pnpmVersion =
      options.pnpmVersion ?? project.package.pnpmVersion ?? "18";
    this.mutableBuild = options.mutableBuild ?? false;

    if (this.github) {
      console.log("github is defined");
    }

    // build job
    //this.addBuildJob();

    //this.workflow.addJob(BUILD_JOBID, {})};
  }

  private renderBuildJob(): Job {
    const project = this.project as NodeProject;
    return {
      runsOn: this.defaultRunners,
      env: {
        CI: "true",
      },
      permissions: {
        contents: JobPermission.WRITE,
      },
      steps: [
        ...this.renderBuildSetup(),
        {
          name: project.buildTask.name,
          run: this.github.project.runTaskCommand(project.buildTask),
        },
      ],
    };
  }

  private renderBuildSetup(): Array<JobStep> {
    const project = this.project as NodeProject;
    return [
      {
        name: "Checkout",
        uses: "actions/checkout@v3",
        with: {
          "fetch-depth": 0,
        },
      },
      {
        name: "Setup pnpm",
        uses: "pnpm/action-setup@v2.2.4",
        with: { version: this.pnpmVersion },
      },
      {
        name: "Setup Node.js",
        uses: "actions/setup-node@v3",
        with: {
          "node-version": this.workflowNodeVersion,
          cache: "pnpm",
        },
      },
      {
        name: "Install dependencies",
        run: this.mutableBuild
          ? project.package.installAndUpdateLockfileCommand
          : project.package.installCommand,
      },
    ];
  }

  preSynthesize(): void {
    this.workflow.addJob(BUILD_JOBID, this.renderBuildJob());
  }
}
