import { TypeScriptProject } from "projen/lib/typescript";
import { VsCodeConfig } from "../vscode";

export const commonProjectSetup = (project: TypeScriptProject) => {
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
