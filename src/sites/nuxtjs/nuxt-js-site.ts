import { paramCase } from "change-case";
import { JsonFile, SampleDir, SampleFile } from "projen";
import { DeployJobOptions, Workflow } from "../../workflows";
import { Site, SiteOptions } from "../site";

export type NuxtJsSiteOptions = SiteOptions;

export class NuxtJsSite extends Site {
  constructor(options: NuxtJsSiteOptions) {
    super({
      // nuxt will supply it's own config
      disableTsconfig: true,
      ...options,
      name: paramCase(options.name),
      artifactsDirectory: "dist",
    });

    /***************************************************************************
     * .gitignore
     **************************************************************************/

    // Nuxt dev/build outputs
    this.gitignore.exclude(
      ".output",
      ".data",
      ".nuxt",
      ".nitro",
      ".cache",
      "dist"
    );
    // Logs
    this.gitignore.exclude("logs", "*.log");

    // Misc
    this.gitignore.exclude(".DS_Store", ".fleet", ".idea");

    // Local env files
    this.gitignore.exclude(".env", ".env.*", "!.env.example");

    /***************************************************************************
     * .npmrc
     **************************************************************************/

    this.npmrc.addConfig("shamefully-hoist", "true");

    /***************************************************************************
     * tsconfig.dev.json
     **************************************************************************/

    // nuxt fixes
    this.tsconfigDev.addInclude("components/**/*.vue");
    this.tsconfigDev.addInclude("components/**/*.ts");
    this.tsconfigDev.addInclude("model/**/*.vue");
    this.tsconfigDev.addInclude("model/**/*.ts");
    this.tsconfigDev.addInclude("pages/**/*.vue");
    this.tsconfigDev.addInclude("pages/**/*.ts");
    this.tsconfigDev.addInclude("plugins/**/*.vue");
    this.tsconfigDev.addInclude("plugins/**/*.ts");

    /***************************************************************************
     * jest configs
     **************************************************************************/

    this.jest!.addTestMatch(
      "<rootDir>/(components|layouts|model|pages|plugins)/**/*(*.)@(spec|test).ts?(x)"
    );

    /***************************************************************************
     * nuxt.config.ts
     **************************************************************************/

    new SampleFile(this, "nuxt.config.ts", {
      contents: [
        `export default defineNuxtConfig({`,
        `  devtools: { enabled: true },`,
        `});`,
        ``,
      ].join("\n"),
    });
    // make sure typescript sees it
    this.tsconfigDev.addInclude("nuxt.config.ts");

    /***************************************************************************
     * tsconfig.json
     * server/tsconfig.json
     **************************************************************************/

    new JsonFile(this, "tsconfig.json", {
      // https://nuxt.com/docs/guide/concepts/typescript
      obj: { extends: "./.nuxt/tsconfig.json" },
    });

    new JsonFile(this, "server/tsconfig.json", {
      obj: { extends: "../.nuxt/tsconfig.server.json" },
    });

    /***************************************************************************
     * package.json
     **************************************************************************/

    this.addDevDeps(
      "@nuxt/devtools@latest",
      "@nuxtjs/tailwindcss",
      "@types/node@^18.17.3",
      "nuxt@^3.6.5",
      "tailwindcss"
    );

    this.addDeps("@heroicons/vue", "@headlessui/vue");

    // nuxt build
    this.addTask("nuxt:build").exec("nuxt build");
    this.addTask("nuxt:dev").exec("nuxt dev");
    this.addTask("nuxt:generate").exec("nuxt generate");
    this.addTask("nuxt:preview").exec("nuxt preview");
    this.addTask("nuxt:postinstall").exec("nuxt prepare");

    /***************************************************************************
     * Initial Files
     **************************************************************************/

    const defaultLayout = [
      `<template>`,
      `  <div class="page-wrapper">`,
      `    <slot />`,
      `  </div>`,
      `</template>`,
    ].join("\n");

    const indexPage = [
      `<template>`,
      `  <div>`,
      `    Index Page`,
      `  </div>`,
      `</template>`,
    ].join("\n");

    new SampleDir(this, "components", {
      files: {
        "README.md": "add components here",
      },
    });

    new SampleDir(this, "layouts", {
      files: {
        "default.vue": defaultLayout,
      },
    });

    new SampleDir(this, "pages", {
      files: {
        "index.vue": indexPage,
      },
    });

    new SampleDir(this, "plugins", {
      files: {
        "README.md": "add plugins here",
      },
    });

    new SampleDir(this, "public", {
      files: {
        "README.md": "add public files here",
      },
    });
  }

  public deploy(
    options: Pick<DeployJobOptions, "branchPrefix" | "environment">
  ) {
    // add to deployment workflow
    return Workflow.deploy(this.parent).addDeployJob({
      ...options,
      deploySteps: [],
      artifactsDirectory: this.artifactsDirectory,
    });
  }
}
