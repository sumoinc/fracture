import { join } from "path";
import { SampleFile } from "projen";
import { JobStep } from "projen/lib/github/workflows-model";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { SetOptional } from "type-fest";
import { Settings } from "../../core/fracture-settings";
import { DeployOptions } from "../../fracture-project";
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
  TypeScriptProjectOptions,
  "defaultReleaseBranch"
>;

export class VitePressSite extends Site {
  constructor(parent: TypeScriptProject, options: VitePressSiteOptions) {
    const { defaultReleaseBranch } = Settings.of(parent);

    super(parent, {
      defaultReleaseBranch,
      ...options,
    });

    // where are ther artifacts for this project going to be stored?
    const { siteRoot } = Settings.of(parent);
    this.artifactDirectories.push(join(siteRoot, this.name, ".vitepress/dist"));

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
    // add commands to run vitepress
    this.addTask("site:dev", {
      exec: "pnpm vitepress dev",
    });
    this.addTask("site:preview", {
      exec: "pnpm vitepress preview",
    });
    this.addTask("site:build", {
      exec: "pnpm vitepress build",
    });
  }

  public deploy(options: DeployOptions) {
    const deploySteps: Array<JobStep> = [
      {
        name: "Deploy the foo",
        run: "echo 'deploying foo'",
      },
    ];
    // add to deployment workflow
    return DeploymentWorkflow.of(this.parent).addDeployJob({
      ...options,
      deploySteps,
      authProvider: options.environment.authProvider,
      artifactDirectories: this.artifactDirectories,
    });
  }
}
