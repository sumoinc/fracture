import { Component } from "projen";
import { GitHub, GithubWorkflow } from "projen/lib/github";
import { JobPermission, JobStep } from "projen/lib/github/workflows-model";
import { Fracture, Pipeline } from "../core";

const PULL_REQUEST_REF = "${{ github.event.pull_request.head.ref }}";
const PULL_REQUEST_REPOSITORY =
  "${{ github.event.pull_request.head.repo.full_name }}";
const BUILD_JOBID = "build";
//const SELF_MUTATION_STEP = "self_mutation";
//const SELF_MUTATION_HAPPENED_OUTPUT = "self_mutation_happened";

export interface DeploymentWorkflowOptions {
  /**
   * The name of the workflow.
   */
  name: string;
}

export class DeploymentWorkflow extends Component {
  private readonly github: GitHub;
  private readonly githubWorkflow: GithubWorkflow;
  private readonly options: Required<DeploymentWorkflowOptions>;

  constructor(
    pipeline: Pipeline,
    options: Partial<DeploymentWorkflowOptions> = {}
  ) {
    super(pipeline.project);

    const github = GitHub.of(pipeline.project);
    if (!github) {
      throw new Error(
        "DeploymentWorkflow is currently only supported for GitHub projects"
      );
    }
    this.github = github;

    const defaultOptions = {
      name: `deploy-${pipeline.name}`,
    };

    this.options = { ...defaultOptions, ...options };
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

    // build
    this.addBuildJob();

    // deploy in waves
    console.log(pipeline.waves.length);
    pipeline.waves.forEach((wave) => {
      console.log(wave.name);
      wave.stages.forEach((stage) => {
        console.log(wave.name, stage.name);
        this.addDeployJob();
      });
    });
  }

  public get name() {
    return this.options.name;
  }

  /*****************************************************************************
   * BUILD & SYTH
   ****************************************************************************/

  private addBuildJob() {
    this.githubWorkflow.addJob(BUILD_JOBID, {
      runsOn: ["ubuntu-latest"],
      env: {
        CI: "true",
      },
      permissions: {
        contents: JobPermission.WRITE,
      },
      steps: (() => this.renderBuildSteps()) as any,
      /*outputs: {
        [SELF_MUTATION_HAPPENED_OUTPUT]: {
          stepId: SELF_MUTATION_STEP,
          outputName: SELF_MUTATION_HAPPENED_OUTPUT,
        },
      },
      */
    });
  }

  /**
   * Called (lazily) during synth to render the build job steps.
   */
  private renderBuildSteps(): JobStep[] {
    const fracture = this.project as Fracture;
    const { buildTask, synthTask } = fracture.turborepo;
    return [
      {
        name: "Checkout",
        uses: "actions/checkout@v3",
        with: {
          ref: PULL_REQUEST_REF,
          repository: PULL_REQUEST_REPOSITORY,
          ...(this.github.downloadLfs ? { lfs: true } : {}),
        },
      },

      //...this.preBuildSteps,
      ...fracture.renderWorkflowSetup({
        mutable: true,
      }),

      {
        name: buildTask.name,
        run: this.github.project.runTaskCommand(buildTask),
      },

      {
        name: synthTask.name,
        run: this.github.project.runTaskCommand(synthTask),
        env: { foo: "bar" },
      },

      //...this.postBuildSteps,

      // check for mutations and upload a git patch file as an artifact
      /*
      ...WorkflowActions.uploadGitPatch({
        stepId: SELF_MUTATION_STEP,
        outputName: SELF_MUTATION_HAPPENED_OUTPUT,
        mutationError:
          "Files were changed during build (see build log). If this was triggered from a fork, you will need to update your branch.",
      }),
      */

      // upload the build artifact only if we have post-build jobs (otherwise, there's no point)
      /*
      ...(this._postBuildJobs.length == 0
        ? []
        : [
            {
              name: "Backup artifact permissions",
              continueOnError: true,
              run: `cd ${this.artifactsDirectory} && getfacl -R . > ${PERMISSION_BACKUP_FILE}`,
            },
            {
              name: "Upload artifact",
              uses: "actions/upload-artifact@v3",
              with: {
                name: BUILD_ARTIFACT_NAME,
                path: this.artifactsDirectory,
              },
            },
          ]),
          */
    ];
  }

  /*****************************************************************************
   * DEPLOY
   ****************************************************************************/

  private addDeployJob() {
    this.githubWorkflow.addJob(BUILD_JOBID, {
      runsOn: ["ubuntu-latest"],
      env: {
        CI: "true",
      },
      permissions: {
        contents: JobPermission.WRITE,
      },
      steps: (() => this.renderBuildSteps()) as any,
      /*outputs: {
        [SELF_MUTATION_HAPPENED_OUTPUT]: {
          stepId: SELF_MUTATION_STEP,
          outputName: SELF_MUTATION_HAPPENED_OUTPUT,
        },
      },
      */
    });
  }
}
