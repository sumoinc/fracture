import { NodePackageManager } from "projen/lib/javascript";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { SetOptional, SetRequired } from "type-fest";

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
   * These opinionated settings that will always be applied to all projects.
   */
  const forcedOptions: Partial<FractureProjectOptions> = {
    prettier: true,
    packageManager: NodePackageManager.PNPM,
    pnpmVersion: "8",
  };

  /**
   * No parent - Use projen's defaults
   */
  if (!options.parent) {
    return {
      // avoids annoying projen requirement
      defaultReleaseBranch: options.defaultReleaseBranch ?? "main",
      ...options,
      ...forcedOptions,
    };
  }

  /**
   * Parent was supplied, inherit certain settings
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
    ...forcedOptions,
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
};
