import { Project } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import {
  CommonProjectOptions,
  setupCommonProjectOptions,
  commonProjectConfiguration,
} from "./common-project";
export interface PackageProjectOptions extends CommonProjectOptions {}

/**
 * Package Project
 */
export class PackageProject extends TypeScriptProject {
  /**
   * Returns all "PackageProjects" in a monorepo.
   */
  public static all(project: Project): Array<PackageProject> {
    const isDefined = (p: Project): p is PackageProject =>
      p instanceof PackageProject;
    return project.root.subprojects.filter(isDefined);
  }

  constructor(options: PackageProjectOptions) {
    super({
      /*************************************************************************
       * DEFAULTS
       ************************************************************************/
      /**
       * All package projects are placed into the packages path structure.
       */
      outdir: options.parent ? `packages/${options.name}` : "",

      /**
       * Always package assets for distribution.
       */
      package: true,

      /**
       * Final distributable assets go to a common directory in the root.
       */
      artifactsDirectory: options.parent ? "dist" : "dist",

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
     * SETUP IGNORES
     *
     **************************************************************************/

    [
      ".DS_Store",
      ".gitattributes",
      ".prettierignore",
      ".prettierrc.json",
      ".projenrc.ts",
      "node_modules",
      "/**/*.spec.*",
    ].forEach((f) => {
      this.addPackageIgnore(f);
    });
  }
}
