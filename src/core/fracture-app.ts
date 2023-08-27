import { join } from "path";
import { paramCase } from "change-case";
import { NodePackageManager } from "projen/lib/javascript";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { Fracture } from "./fracture";

export interface FractureAppOptions extends Partial<TypeScriptProjectOptions> {
  /**
   * Name for the app. This also becomes the directory where the app is created.
   */
  name: string;
}

export class FractureApp extends TypeScriptProject {
  constructor(fracture: Fracture, options: FractureAppOptions) {
    /***************************************************************************
     * Projen Props
     **************************************************************************/

    // ensure name is param-cased for outdir
    const outdir = join(fracture.appRoot, paramCase(options.name));

    const projenOptions: TypeScriptProjectOptions = {
      name: options.name,
      defaultReleaseBranch: fracture.defaultReleaseBranch,
      parent: fracture,
      outdir,
      eslintOptions: {
        dirs: ["src"],
        tsconfigPath: "./**/tsconfig.dev.json",
      },
      licensed: false,
      prettier: true,
      projenrcTs: true,

      // pnpm configs
      packageManager: NodePackageManager.PNPM,
      pnpmVersion: "8",
    };

    super(projenOptions);

    /***************************************************************************
     * Props
     **************************************************************************/

    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     * These are the options that will be used through all code generation
     * unless explicitly overridden.
     *
     **************************************************************************/

    // ensure name is param-cased
    // const forcedOptions: Partial<FractureAppOptions> = {
    //   name: paramCase(options.name),
    // };

    // // all other options
    // const mergedOptions = deepMerge([
    //   { ...fracture.options },
    //   options,
    //   forcedOptions,
    // ]) as Required<FractureAppOptions>;

    /***************************************************************************
     *
     * CREATE SUB-PROJECT
     *
     * This powers a sub-project to house all generated code.
     *
     **************************************************************************/

    // Build sub project

    // const project = new TypeScriptProject({
    //   defaultReleaseBranch: "main",
    //   name: options.name,
    //   parent: fracture,
    //   licensed: false,
    //   outdir: join(fracture.appRoot, mergedOptions.name),
    //   packageManager: NodePackageManager.PNPM,
    //   pnpmVersion: "8",
    //   prettier: true,
    //   projenrcTs: true,
    //   deps: ["aws-cdk", "aws-cdk-lib", "constructs", "esbuild"],
    //   eslintOptions: {
    //     dirs: ["src"],
    //     tsconfigPath: "./**/tsconfig.dev.json",
    //   },
    // });
    // this.project = project;

    // this.project.gitignore.exclude("/cdk.out/");

    // this.fracture = fracture;
    // this.options = mergedOptions;

    /***************************************************************************
     *
     * INIT SERVICE
     *
     **************************************************************************/

    // this.fracture.logger.info("-".repeat(80));
    // this.fracture.logger.info(`INIT APP: "${this.name}"`);
    // this.fracture.logger.info("-".repeat(80));

    // // inverse
    // this.fracture.apps.push(this);

    /***************************************************************************
     *
     * CDK CONFIG
     *
     **************************************************************************/

    // new JsonFile(this.project, "cdk.json", {
    //   obj: {
    //     app: "npx ts-node --prefer-ts-exts src/build.ts",
    //     requireApproval: "never",
    //   },
    // });

    return this;
  }

  /*

  public get name(): string {
    return this.options.name;
  }

  public get srcDir() {
    return this.options.srcDir;
  }

  public get appRoot() {
    return join(this.fracture.appRoot, this.name);
  }

  public useService(service: Service) {
    this.project.addDeps(`${service.fracture.name}@workspace:*`);
    this.services.push(service);
  }
  */

  /*

  */
}
