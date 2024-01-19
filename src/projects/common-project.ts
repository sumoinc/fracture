import { Project } from "projen";
import { NodePackageManager } from "projen/lib/javascript";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { JsiiFaker } from "../jsii";
import { Jest } from "../tests/jest";
import { VsCodeConfig } from "../vscode";

export interface CommonProjectOptions
  extends Omit<TypeScriptProjectOptions, "defaultReleaseBranch"> {}

/**
 * Common Project
 *
 * This is a simple Typescript project, but no CDK or package specific settings.
 */
export class CommonProject extends TypeScriptProject {
  /**
   * Returns all packages in the monorepo.
   */
  public static all(project: Project): Array<CommonProject> {
    const isDefined = (p: Project): p is CommonProject =>
      p instanceof CommonProject;
    return project.root.subprojects.filter(isDefined);
  }

  constructor(options: CommonProjectOptions) {
    const outdir: string = options.parent ? options.name : "";
    const artifactsDirectory: string = options.parent ? "dist" : "dist";

    super({
      /*************************************************************************
       * DEFAULTS
       ************************************************************************/
      /**
       * All package projects are placed into the packages path structure.
       */
      outdir,

      /**
       * Always package assets for distribution.
       */
      package: true,

      /**
       * Final distributable assets go to a common directory in the root.
       */
      artifactsDirectory,

      /*************************************************************************
       * INPUTS
       ************************************************************************/

      ...setupCommonProjectOptions(options),
    });

    /***************************************************************************
     *
     * COMMON SETUP
     *
     **************************************************************************/

    commonProjectConfiguration(this);

    /***************************************************************************
     *
     * JSII REGISTRATION
     *
     **************************************************************************/

    const jsii = JsiiFaker.of(this) ?? new JsiiFaker(this);
    jsii.addClassType({
      name: "CommonProject",
    });
  }
}

export const setupCommonProjectOptions = (
  options: CommonProjectOptions
): TypeScriptProjectOptions => {
  return {
    /***************************************************************************
     * ROOT PROJECT OPTIONS
     **************************************************************************/

    ...(options.parent === undefined
      ? {
          /**
           * Use ts file and not js.
           */
          projenrcTs: true,
        }
      : {}),

    /***************************************************************************
     * COMMON OPTIONS
     **************************************************************************/

    /**
     * Use main branch. It's 2023 by the way.
     */
    defaultReleaseBranch: "main",

    /**
     * No license by default.
     */
    licensed: false,

    /**
     * Use Node 18.x by default for package builds
     */
    workflowNodeVersion: "18",

    /**
     * Enable prettier for some great formatting.
     */
    prettier: true,

    /**
     * PNPM 8 all the way baby!
     */
    packageManager: NodePackageManager.PNPM,
    pnpmVersion: "8",

    /**
     * Turn off the native jest support, we will be adding our own Jest
     * config beflow.
     */
    jest: false,

    /***************************************************************************
     * INPUT OPTIONS
     **************************************************************************/

    ...options,
  };
};

export const commonProjectConfiguration = (
  project: TypeScriptProject
  /*options: CommonProjectOptions*/
) => {
  /**
   * ROOT PROJECT SETUP
   *
   * Setup for monorepo roots, or projects that are not monorepos.
   */
  if (project.parent === undefined) {
    // add vs code configuration
    new VsCodeConfig(project);
  }

  /**
   * ALL PROJECTS SETUP
   */

  // setup jest for testing.
  new Jest(project);

  // track metadata for the repo we're using for this
  // new Repository(project, { repository: options.repository });
  // never check these files into git
  [".DS_Store"].forEach((f) => {
    project.addGitIgnore(f);
  });
};
