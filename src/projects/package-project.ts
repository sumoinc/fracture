import { Project } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import {
  CommonProjectOptions,
  commonProjectConfiguration,
  setupCommonProjectOptions,
} from "./common";

export interface PackageProjectOptions extends CommonProjectOptions {
  // readonly parent: MonorepoProject;
  // readonly testingOptions?: TestingOptions;
}

/**
 * Package Project
 */
export class PackageProject extends TypeScriptProject {
  /**
   * Returns all packages in the monorepo.
   */
  public static all(project: Project): Array<PackageProject> {
    const isDefined = (p: Project): p is PackageProject =>
      p instanceof PackageProject;
    return project.root.subprojects.filter(isDefined);
  }

  /**
   * The testing settings for this project.
   */
  // public testing?: Testing;

  constructor(options: PackageProjectOptions) {
    /**
     * Is this a root level project? This determines what folder structure to
     * use when storing the project.
     */
    //const isRootProject: boolean = options.parent === undefined;

    const outdir: string = options.parent ? `packages/${options.name}` : "";

    const artifactsDirectory: string = options.parent ? "dist" : "dist";

    /**
     * Builds a cachable output path at the root of the monorepo for dist
     * and other deployable artifacts.
     */
    /*
    const buildOutputPath = (name: string) => {
      return join(
        "../..",
        options.parent.deploymentArtifactRoot,
        `packages/${options.name}`,
        name
      );
    };*/

    super({
      /*************************************************************************
       * DEFAULTS
       ************************************************************************/
      /**
       * All package projects are placed into the packages path structure.
       */
      // outdir: `packages/${options.name}`,
      outdir,

      /**
       * Always package assets for distribution.
       */
      package: true,

      /**
       * Final distributable assets go to a common directory in the root.
       */
      // artifactsDirectory: buildOutputPath("dist"),
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

    commonProjectConfiguration(this, options);

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

    [".DS_Store"].forEach((f) => {
      this.addGitIgnore(f);
    });

    /***************************************************************************
     *
     * CONFIGURE TURBO
     *
     **************************************************************************/

    // if (Turbo.isActive(this)) {
    //   const turbo = Turbo.of(this)!;

    //   /**
    //    * Testing uses ts-jest so it doesn't depend on anyother tasks.
    //    */
    //   turbo.addTask(this, {
    //     projenTask: this.testTask,
    //     cachable: true,
    //     inputPaths: ["jest.config.json", ...Turbo.commonInputs(this)],
    //     outputPaths: ["coverage/**", "test-reports/**"],
    //   });

    //   /**
    //    * Compile and Package need to happen in a particular order.
    //    */
    //   const turboCompile = turbo.addTask(this, {
    //     projenTask: this.compileTask,
    //     cachable: true,
    //     inputPaths: [...Turbo.commonInputs(this)],
    //     outputPaths: [`${this.libdir}/**`],
    //   });
    //   const turboPackage = turbo.addTask(this, {
    //     projenTask: this.packageTask,
    //     cachable: true,
    //     inputPaths: [...Turbo.commonInputs(this)],
    //     outputPaths: [`${this.artifactsDirectory}/**`],
    //   });
    //   turboCompile.thenRun(turboPackage);
    // }
  }
}
