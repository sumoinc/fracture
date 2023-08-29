import {
  NodePackageManager,
  NodeProject,
  NodeProjectOptions,
} from "projen/lib/javascript";
import { SetOptional } from "type-fest";

export const filesToScaffold = [
  "template/api-examples.md",
  "template/index.md",
  "template/markdown-examples.md",
  "template/.vitepress/config.js",
  "template/.vitepress/theme/index.js",
  "template/.vitepress/theme/style.css",
  "template/.vitepress/theme/Layout.vue",
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
      copyrightOwner: options.copyrightOwner,
      prettier: options.prettier ?? true,
      packageManager: options.packageManager ?? NodePackageManager.PNPM,
      pnpmVersion: options.pnpmVersion ?? "8",
      parent: project,
      ...options,
    });

    this.addDevDeps("vitepress");

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

    console.log(this.outdir);
  }
}
