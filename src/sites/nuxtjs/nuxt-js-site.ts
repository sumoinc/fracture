import { paramCase } from "change-case";
import { SampleDir, SourceCode } from "projen";
import { Site, SiteOptions } from "../site";

export type NuxtJsSiteOptions = SiteOptions;

export class NuxtJsSite extends Site {
  constructor(options: NuxtJsSiteOptions) {
    super({
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
     * nuxt.config.ts
     **************************************************************************/

    const nuxtConfig = new SourceCode(this, "nuxt.config.ts");
    nuxtConfig.line(`export default defineNuxtConfig({`);
    nuxtConfig.line(`  devtools: { enabled: true },`);
    nuxtConfig.line(`});`);

    /***************************************************************************
     * tsconfig.json
     * server.tsconfig.json
     **************************************************************************/

    /* 2023-09-07 - removing during refactoring
    new JsonFile(this, "tsconfig.json", {
      // https://nuxt.com/docs/guide/concepts/typescript
      obj: { extends: "./.nuxt/tsconfig.json" },
    });

    new JsonFile(this, "server/tsconfig.json", {
      obj: { extends: "../.nuxt/tsconfig.server.json" },
    });
    */

    /***************************************************************************
     * package.json
     **************************************************************************/

    this.addDevDeps(
      "@nuxt/devtools@latest",
      "@types/node@^18.17.3",
      "nuxt@^3.6.5"
    );

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

    new SampleDir(this, "conponents", {
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
}
