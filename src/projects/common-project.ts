import { Project } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import {
  CommonProjectOptions,
  commonProjectConfiguration,
  setupCommonProjectOptions,
} from "./common";

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
  }
}
