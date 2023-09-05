import { join } from "path";
import { SampleFile } from "projen";
import { JobStep } from "projen/lib/github/workflows-model";
import { NodeProject, NodeProjectOptions } from "projen/lib/javascript";
import { SetOptional } from "type-fest";
import { Settings } from "../../core/fracture-settings";
import { DeployOptions } from "../../fracture-project";
import { TurboRepo } from "../../turborepo";
import { DeploymentWorkflow } from "../../workflows/deployment-workflow";
import { Site } from "../site";

export const filesToScaffold = [
  "api-examples.md",
  "index.md",
  "markdown-examples.md",
  ".vitepress/config.mts",
  ".vitepress/theme/index.ts",
  ".vitepress/theme/style.css",
  ".vitepress/theme/Layout.vue",
];

export type VitePressSiteOptions = SetOptional<
  NodeProjectOptions,
  "defaultReleaseBranch"
>;

export class VitePressSite extends Site {
  constructor(
    public readonly parent: NodeProject,
    options: VitePressSiteOptions
  ) {
    const { defaultReleaseBranch } = Settings.of(parent);

    super(parent, {
      defaultReleaseBranch,
      ...options,
    });

    // where are the distribution and other artifacts for this project going to
    // be stored?
    const { siteRoot } = Settings.of(parent);
    this.distDirectory = join(siteRoot, this.name, ".vitepress/dist");
    this.artifactDirectories.push(this.distDirectory);

    // ignore a few vitepress specific things
    this.addDevDeps("vitepress");
    this.addGitIgnore(".vitepress/dist");
    this.addGitIgnore(".vitepress/cache");

    /**
     * !!! BIG CHEAT !!!
     *
     * These files are adapted from scaffold(), found here:
     * https://github.com/vuejs/vitepress/blob/main/src/node/init/init.ts
     *
     * Templates are all found here:
     * https://github.com/vuejs/vitepress/tree/main/template
     *
     **/
    filesToScaffold.map((file) => {
      new SampleFile(this, file, {
        sourcePath: join(__dirname, "template", file),
      });
    });

    /***
     * Add some shortcut commends that vitepress devs will expect to exist.
     */
    // add commands to run vitepress.
    this.addTask("docs:dev", {
      exec: "pnpm vitepress dev",
    });
    this.addTask("docs:preview", {
      exec: "pnpm vitepress preview",
    });
    this.addTask("docs:build", {
      exec: "pnpm vitepress build",
    });
    this.addTask("docs:test", {
      exec: "echo 'docs:test does nothing yet'",
    });

    /**
     * Add build tasks to turbo's pipeline.
     */
    const turbo = TurboRepo.of(parent);
    turbo.taskSets.push({
      name: this.name,
      buildTask: {
        "docs:build": {
          outputs: [".vitepress/dist/**"],
        },
      },
      testTask: {
        "docs:test": {
          cache: true,
        },
      },
    });
  }

  public deploy(options: DeployOptions) {
    const deploySteps: Array<JobStep> = [
      {
        name: "Deploy the foo",
        run: "echo 'deploying foo'",
      },
    ];

    // set deploy directory, if needed
    //if (options.environment instanceof NetlifyEnvironment) {
    options.environment.deployDir = this.distDirectory;
    // }

    // add to deployment workflow
    return DeploymentWorkflow.of(this.parent).addDeployJob({
      ...options,
      deploySteps,
      artifactDirectories: this.artifactDirectories,
    });
  }
}
