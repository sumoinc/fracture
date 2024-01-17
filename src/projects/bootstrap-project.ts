import { TypeScriptProject } from "projen/lib/typescript";
import {
  CommonProjectOptions,
  commonProjectConfiguration,
  setupCommonProjectOptions,
} from "./common";
import { Jest } from "../tests/jest";

export interface BootstrapProjectOptions extends CommonProjectOptions {}

/**
 * Bootstrap Project
 *
 * This project type is used to setup initial CDK bootstraping and set initial
 * OIDC Roles into AWS for CI deployment scripts.
 *
 * This project type is designed to be run locally by an admin and not via CI.
 */
export class BootstrapProject extends TypeScriptProject {
  constructor(options: BootstrapProjectOptions) {
    super({
      /*************************************************************************
       * DEFAULTS
       ************************************************************************/
      /**
       * All package projects are placed into the packages path structure.
       */
      outdir: options.parent ? `bootstrap` : "",

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
