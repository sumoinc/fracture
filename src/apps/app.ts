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
import { DeployJobOptions, Workflow } from "../workflows";

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

    // strip org scopes from folder structure, if given
    const subdir =
      options.name.split("/").length === 2
        ? options.name.split("/")[1]
        : options.name;

    // set up the outdir
    const outdir = join(appRoot, subdir);

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

  public deploy(
    options: Pick<DeployJobOptions, "branchPrefix" | "environment">
  ) {
    const branchPrefix = options.branchPrefix ?? "main";
    // add to deployment workflow
    return Workflow.deploy(this.parent).addDeployJob({
      ...options,
      branchPrefix,
      appName: this.name,
      deploySteps: [
        {
          name: "deploy",
          run: `npx aws-cdk deploy --require-approval never --app ${this.artifactsDirectory} *-${branchPrefix}-${options.environment.name}`,
          // inlineScript: $(PACKAGE_MANAGER.PACKAGE_MANAGER_TYPE) cdk deploy --require-approval never --app 'cdk.out/${{ parameters.target_environment }}' ${{ parameters.cdk_stack_names }}
        },
      ],
      artifactsDirectory: this.artifactsDirectory,
    });
  }
}
