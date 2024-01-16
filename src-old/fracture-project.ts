import { NodePackageManager } from "projen/lib/javascript";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { SetOptional, SetRequired } from "type-fest";
import { VsCodeConfiguration } from "./projen";

export interface FractureProjectOptions
  extends SetOptional<TypeScriptProjectOptions, "defaultReleaseBranch"> {
  /**
   * The parent project, if there is one.
   */
  readonly parent?: TypeScriptProject;
}

/**
 * Subprojects have all the same options as projects, except a parent project
 * is required.
 */
export interface FractureSubProjectOptions
  extends SetRequired<FractureProjectOptions, "parent"> {}

export class FractureProject extends TypeScriptProject {
  constructor(options: FractureProjectOptions) {
    super(fractureProjectOptions(options));
    // initialize the project
    fractureProjectInit(this);
  }
}

export class FractureSubProject extends FractureProject {
  /**
   * sub-project's parent project
   */
  readonly parent: TypeScriptProject;

  constructor(options: FractureSubProjectOptions) {
    super(options);
    this.parent = options.parent;
  }
}

export const fractureProjectOptions = (options: FractureProjectOptions) => {
  /**
   * The outdir is typically specified in a subclass.
   */
  if (options.parent && !options.outdir) {
    throw new Error(
      "outdir for the subproject must be specified when parent is specified"
    );
  }

  /**
   * No parent - Use projen's defaults
   */
  if (!options.parent) {
    return {
      // avoids annoying projen requirement
      defaultReleaseBranch: options.defaultReleaseBranch ?? "main",
      ...options,
      prettier: true,
      packageManager: NodePackageManager.PNPM,
      pnpmVersion: "8",
      projenrcTs: true,
      deps: ["@sumoc/fracture"],
      package: false,
    };
  }

  /**
   * Parent was supplied, inherit certain settings, force others
   */
  return {
    // avoids annoying projen requirement
    defaultReleaseBranch: options.defaultReleaseBranch ?? "main",
    // don't license subprojects, the root project should have a licence already.
    licensed: false,
    // tell linter to use root project's settings
    eslintOptions: {
      dirs: ["src"],
      tsconfigPath: "./**/tsconfig.dev.json",
    },
    ...options,
    prettier: true,
    packageManager: NodePackageManager.PNPM,
    pnpmVersion: "8",
  };
};

export const fractureProjectInit = (project: TypeScriptProject) => {
  // don't package
  project.packageTask.reset();
  // don't allow default to run in subprojects, otherwise it runs root and
  // causes unwanted recusion.
  if (project.parent) {
    project.defaultTask?.reset();
  }

  // de certain things if this is root project
  if (!project.parent) {
    // init vscode
    new VsCodeConfiguration(project);
  }
};
