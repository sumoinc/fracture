import { join } from "path";
import { paramCase } from "change-case";
import { Project } from "projen";
import { NodePackageManager } from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";
import { deepMerge } from "projen/lib/util";
import { Fracture } from "./fracture";

export interface FractureAppOptions {
  name: string;
  srcDir?: string;
}

export class FractureApp {
  // member components
  public readonly project: Project;
  // parent
  public readonly fracture: Fracture;
  // all other options
  public readonly options: Required<FractureAppOptions>;
  // generators

  constructor(fracture: Fracture, options: FractureAppOptions) {
    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     * These are the options that will be used through all code generation
     * unless explicitly overridden.
     *
     **************************************************************************/

    // ensure name is param-cased
    const forcedOptions: Partial<FractureAppOptions> = {
      name: paramCase(options.name),
    };

    // all other options
    const mergedOptions = deepMerge([
      { ...fracture.options },
      options,
      forcedOptions,
    ]) as Required<FractureAppOptions>;

    /***************************************************************************
     *
     * CREATE SUB-PROJECT
     *
     * This powers a sub-project to house all generated code.
     *
     **************************************************************************/

    // Build sub project
    const project = new TypeScriptProject({
      defaultReleaseBranch: "main",
      name: options.name,
      parent: fracture,
      licensed: false,
      outdir: join(fracture.appRoot, mergedOptions.name),
      packageManager: NodePackageManager.PNPM,
      pnpmVersion: "8",
      prettier: true,
      projenrcTs: true,
      eslintOptions: {
        dirs: ["src"],
        tsconfigPath: "./**/tsconfig.dev.json",
      },
    });
    this.project = project;

    this.fracture = fracture;
    this.options = mergedOptions;

    /***************************************************************************
     *
     * INIT SERVICE
     *
     **************************************************************************/

    this.fracture.logger.info("-".repeat(80));
    this.fracture.logger.info(`INIT APP: "${this.name}"`);
    this.fracture.logger.info("-".repeat(80));

    // inverse
    this.fracture.apps.push(this);

    return this;
  }

  public build() {}

  public get name(): string {
    return this.options.name;
  }

  public get srcDir() {
    return this.options.srcDir;
  }
}
