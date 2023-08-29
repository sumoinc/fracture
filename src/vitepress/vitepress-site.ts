import { join } from "path";
import { SampleFile } from "projen";
import {
  NodePackageManager,
  NodeProject,
  NodeProjectOptions,
} from "projen/lib/javascript";
import { SetOptional } from "type-fest";

export const filesToScaffold = [
  "api-examples.md",
  "index.md",
  "markdown-examples.md",
  ".vitepress/config.mts",
  ".vitepress/theme/index.ts",
  ".vitepress/theme/style.css",
  ".vitepress/theme/Layout.vue",
];

export class VitePressSite extends NodeProject {
  constructor(
    project: NodeProject,
    options: SetOptional<
      NodeProjectOptions,
      "name" | "defaultReleaseBranch"
    > = {}
  ) {
    super({
      name: "docs",
      outdir: "docs",
      defaultReleaseBranch: "main",
      license: options.license ?? "MIT",
      prettier: options.prettier ?? true,
      packageManager: options.packageManager ?? NodePackageManager.PNPM,
      pnpmVersion: options.pnpmVersion ?? "8",
      parent: project,
      ...options,
    });

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

    // add commands to run vitepress
    this.addTask("docs:dev", {
      exec: "pnpm vitepress dev",
    });
    const build = this.addTask("docs:build", {
      exec: "pnpm vitepress build",
    });
    this.addTask("docs:preview", {
      exec: "pnpm vitepress preview",
    });

    this.defaultTask?.spawn(build);
  }
}
