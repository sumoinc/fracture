import { join } from "path";
import { SampleFile } from "projen";
import { JobStep } from "projen/lib/github/workflows-model";
import { NodeProject, NodeProjectOptions } from "projen/lib/javascript";
import { SetOptional } from "type-fest";
import { Settings } from "../../settings";
import { TurboRepo } from "../../turborepo";
import { DeployJobOptions } from "../../workflows";
import { Workflow } from "../../workflows/workflow";
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
    const { defaultReleaseBranch, siteRoot } = Settings.of(parent);

    super(parent, {
      defaultReleaseBranch,
      ...options,
      artifactsDirectory: join(siteRoot, options.name, ".vitepress/dist"),
    });

    //this.artifactDirectories.push(this.distDirectory);

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

  public deploy(
    options: Pick<DeployJobOptions, "branchPrefix" | "environment">
  ) {
    const deploySteps: Array<JobStep> = [
      {
        name: "Deploy the foo",
        run: "echo 'deploying foo'",
      },
    ];

    // add to deployment workflow
    return Workflow.deploy(this.parent).addDeployJob({
      ...options,
      deploySteps,
      artifactsDirectory: this.artifactsDirectory,
    });
  }
}
