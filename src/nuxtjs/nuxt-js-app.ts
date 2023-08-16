import { join } from "path";
import { paramCase } from "change-case";
import { JsonFile, SampleDir, SourceCode } from "projen";
import {
  NodePackageManager,
  NodeProject,
  NodeProjectOptions,
} from "projen/lib/javascript";
import { Fracture } from "../core";
import { Netlify, NetlifyOptions } from "../netlify/netlify";

export interface NuxtJsAppOptions extends Partial<NodeProjectOptions> {
  /**
   * Name for the app. This also becomes the directory where the app is created.
   */
  name: string;
  /**
   * Should this app be deployed to Netlify?
   *
   * @default false
   */
  netlify?: boolean;
  /**
   * Options for Netlify deployment.
   *
   * @default {}
   */
  netlifyOptions?: NetlifyOptions;
}

export class NuxtJsApp extends NodeProject {
  /**
   * Name for the app. This also becomes the directory where the app is created.
   */
  public readonly name: string;
  /**
   * Should this app be deployed to Netlify?
   *
   * @default false
   */
  public readonly netlify: boolean;
  /**
   * Options for Netlify deployment.
   *
   * @default {}
   */
  public readonly netlifyOptions: NetlifyOptions;

  constructor(fracture: Fracture, options: NuxtJsAppOptions) {
    /***************************************************************************
     * Projen Props
     **************************************************************************/

    // ensure name is param-cased for outdir
    const outdir = join(fracture.appRoot, paramCase(options.name));

    const projenOptions: NodeProjectOptions = {
      name: options.name,
      defaultReleaseBranch: "main",
      parent: fracture,
      packageManager: NodePackageManager.PNPM,
      pnpmVersion: "8",
      outdir,
      licensed: false,
    };

    super(projenOptions);

    /***************************************************************************
     * PROPS
     **************************************************************************/

    this.name = options.name;
    this.netlify = options.netlify ?? false;
    this.netlifyOptions = options.netlifyOptions ?? {};

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

    /***************************************************************************
     * CONFIGURE NETLIFY DEPLOYMENT
     **************************************************************************/

    if (this.netlify) {
      new Netlify(fracture, options.netlifyOptions ?? { nameBase: this.name });
    }
  }
}
