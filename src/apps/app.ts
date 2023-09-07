import { join } from "path";

import {
  AwsCdkTypeScriptApp,
  AwsCdkTypeScriptAppOptions,
} from "projen/lib/awscdk";
import { TypeScriptProject } from "projen/lib/typescript";
import { SetRequired } from "type-fest";
import {
  FractureSubProjectOptions,
  fractureProjectInit,
  fractureProjectOptions,
} from "../fracture-project";
import { Settings } from "../settings";
import { TurboRepo } from "../turborepo";

export type AppOptions = Omit<
  SetRequired<Partial<AwsCdkTypeScriptAppOptions>, "name">,
  "parent"
> &
  FractureSubProjectOptions;

export class App extends AwsCdkTypeScriptApp {
  /**
   *
   */
  readonly parent: TypeScriptProject;

  constructor(options: AppOptions) {
    // All apps must have a parent project.
    if (!options.parent) {
      throw new Error("all apps must have a parent project");
    }

    // grab settings from parent project
    const { defaultCdkVersion, appRoot } = Settings.of(options.parent);

    // make sure services is configured as a workspace
    TurboRepo.of(options.parent).addWorkspaceRoot(appRoot);

    // set up the outdir
    const outdir = join(appRoot, options.name);

    super({
      cdkVersion: defaultCdkVersion,
      // merge with global settings
      ...fractureProjectOptions({
        ...options,
        outdir,
      }),
      artifactsDirectory: join(outdir, "cdk.out"),
    });

    this.parent = options.parent;

    // init some common things we need here
    fractureProjectInit(this);
  }
}
