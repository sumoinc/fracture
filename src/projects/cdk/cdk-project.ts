import { TypeScriptProject } from "projen/lib/typescript";
import { Jest } from "../../tests/jest";
import {
  CommonProjectOptions,
  commonProjectConfiguration,
  setupCommonProjectOptions,
} from "../common";

export interface CdkProjectOptions extends CommonProjectOptions {}

/**
 * CDK Project Project
 */
export class CdkProject extends TypeScriptProject {
  constructor(options: CdkProjectOptions) {
    super({
      /*************************************************************************
       * DEFAULTS
       ************************************************************************/

      /**
       * All package projects are placed into the packages path structure.
       */
      outdir: options.parent ? `apps/${options.name}` : "",

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

    commonProjectConfiguration(this, options);

    /***************************************************************************
     *
     * SETUP IGNORES
     *
     **************************************************************************/

    [].forEach((f) => {
      this.addPackageIgnore(f);
    });

    [].forEach((f) => {
      this.addGitIgnore(f);
    });

    /***************************************************************************
     *
     * SETUP TESTING
     *
     **************************************************************************/

    new Jest(this);
  }
}
