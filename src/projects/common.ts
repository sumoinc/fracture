import { NodePackageManager } from "projen/lib/javascript";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { VsCodeConfig } from "../vscode";

export interface CommonProjectOptions
  extends Omit<TypeScriptProjectOptions, "defaultReleaseBranch"> {}

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

export const commonProjectConfiguration = (project: TypeScriptProject) => {
  /**
   * ROOT PROJECT SETUP
   *
   * Setup for monorepo roots, or projects that are not monorepos.
   */
  if (project.parent === undefined) {
    // add vs code configuration
    new VsCodeConfig(project);
  }
};
