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
  ".vitepress/config.js",
  ".vitepress/theme/index.js",
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
    console.log(this.outdir);

    /**
     * !!! BIG CHEAT !!!
     *
     * These files are from scaffold(), found here:
     * https://github.com/vuejs/vitepress/blob/main/src/node/init/init.ts
     *
     * Templates are all found here:
     * https://github.com/vuejs/vitepress/tree/main/template
     *
     **/
    filesToScaffold.map((file) => {
      new SampleFile(this, join("content", file), {
        sourcePath: join(__dirname, "template", file),
      });
    });
  }
}
