import { join } from "path";
import { Component, JsonFile } from "projen";
import { NodePackageManager } from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";
import { FracturePackage } from "./fracture-package";
import { FractureProject } from "./fracture-project";

/**
 *
 */
export interface FractureAppOptions {}

/**
 * The root of a package
 */
export class FractureApp extends Component {
  // member components
  public readonly fracturePackages: FracturePackage[] = [];
  // project and namespace
  public readonly project: TypeScriptProject;
  public readonly fractureProject: FractureProject;
  public readonly namespace: string;
  public readonly outdir: string;
  // all other options
  public readonly options: Required<FractureAppOptions>;

  constructor(
    fractureProject: FractureProject,
    namespace: string,
    options: FractureAppOptions = {}
  ) {
    /***************************************************************************
     *
     * CREATE APP SUB-PROJECT
     *
     * This will hold all the app code for the CDK app.
     *
     **************************************************************************/

    // Build sub project
    const project = new TypeScriptProject({
      defaultReleaseBranch: "main",
      name: namespace,
      parent: fractureProject,
      licensed: false,
      outdir: join(fractureProject.appDir, namespace),
      packageManager: NodePackageManager.PNPM,
      pnpmVersion: "8",
      prettier: true,
      projenrcTs: true,
      deps: ["aws-cdk", "aws-cdk-lib", "constructs"],
      devDeps: [],
      eslintOptions: {
        dirs: ["src"],
        tsconfigPath: "./**/tsconfig.dev.json",
      },
    });
    super(project);

    this.project = project;
    this.namespace = namespace;
    //fractureProject.fractureApps.push(this);
    this.fractureProject = fractureProject;

    // all generated code ends up in src folder
    this.outdir = join("src");

    /***************************************************************************
     *
     * INIT FRACTURE
     *
     **************************************************************************/

    // member components

    // project and namespace

    // all other options
    this.options = options;

    this.project.logger.info("=".repeat(80));
    this.project.logger.info(`INIT App: "${this.project.name}"`);
    this.project.logger.info(`           outdir: "${this.outdir}"`);

    // TODO: write build.ts file here

    // add CDK config
    new JsonFile(this.project, "cdk.json", {
      obj: {
        app: "npx ts-node --prefer-ts-exts src/build.ts",
        requireApproval: "never",
      },
    });

    // add synth command
    const task = this.project.addTask("synth:blah", {
      description: "Synth CDK web assembly.",
    });
    task.exec(`cdk synth`);

    // add deploy command

    return this;
  }

  /**
   * Build the package.
   *
   * Call this when you've configured everything, prior to preSynthesize.
   *
   * @returns void
   */
  public build() {
    this.project.logger.info(`BUILD APP: "${this.project.name}"`);
  }

  /*****************************************************************************
   *
   *  Configuration Helpers
   *
   ****************************************************************************/

  /**
   * Add a service to the fracture project.
   * @param {FracturePackage}
   * @returns {FracturePackage}
   */
  public addFracturePackage(fp: FracturePackage) {
    return this.fracturePackages.push(fp);
  }
}
