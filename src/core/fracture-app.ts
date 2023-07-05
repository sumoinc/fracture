import { join } from "path";
import { paramCase } from "change-case";
import { JsonFile } from "projen";
import { NodePackageManager } from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";
import { deepMerge } from "projen/lib/util";
import { Fracture } from "./fracture";
import { Pipeline, PipelineOptions } from "./pipeline";
import { Service } from "./service";

export interface FractureAppOptions {
  name: string;
  srcDir?: string;
}

export class FractureApp {
  // member components
  public readonly project: TypeScriptProject;
  public readonly services: Service[] = [];
  public readonly pipelines: Pipeline[] = [];
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
      deps: ["aws-cdk", "aws-cdk-lib", "constructs", "esbuild"],
      eslintOptions: {
        dirs: ["src"],
        tsconfigPath: "./**/tsconfig.dev.json",
      },
    });
    this.project = project;

    this.project.gitignore.exclude("/cdk.out/");

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

    /***************************************************************************
     *
     * CDK CONFIG
     *
     **************************************************************************/

    new JsonFile(this.project, "cdk.json", {
      obj: {
        app: "npx ts-node --prefer-ts-exts src/build.ts",
        requireApproval: "never",
      },
    });
    return this;
  }

  // public build() {
  //   /***************************************************************************
  //    *
  //    * CDK SYNTH COMMAND
  //    *
  //    * Do this step in the build process so that we can know all the environments.
  //    *
  //    **************************************************************************/

  //   const synthTask = this.project.addTask("synth", {
  //     description: "Synth Cloud Assembly.",
  //   });

  //   // clean the cdk.out folder out
  //   synthTask.exec(`rm -rf cdk.out`);

  //   // build for each environment
  //   this.pipelines.forEach((pipeline) => {
  //     pipeline.waves.forEach((wave) => {
  //       wave.stages.forEach((stage) => {
  //         synthTask.exec(
  //           `set CDK_DEFAULT_ACCOUNT=${stage.account.id} CDK_DEFAULT_REGION=${
  //             stage.region
  //           } && pnpm cdk synth -q --output=cdk.out/${join(
  //             stage.account.id,
  //             stage.region
  //           )}`
  //         );
  //       });
  //     });
  //   });
  // }

  public get name(): string {
    return this.options.name;
  }

  public get srcDir() {
    return this.options.srcDir;
  }

  public useService(service: Service) {
    this.project.addDeps(`${service.fracture.name}@workspace:*`);
    this.services.push(service);
  }

  public addPipeline(options: Omit<PipelineOptions, "app">) {
    return new Pipeline(this.fracture, { ...options, app: this });
  }
}
