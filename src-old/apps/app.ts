import { join } from "path";

import {
  AwsCdkTypeScriptApp,
  AwsCdkTypeScriptAppOptions,
} from "projen/lib/awscdk";
import { TypeScriptProject } from "projen/lib/typescript";
import { SetRequired } from "type-fest";
import { AwsEnvironment } from "../environments";
import {
  FractureSubProjectOptions,
  fractureProjectInit,
  fractureProjectOptions,
} from "../fracture-project";
import { DataService } from "../services";
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
  public readonly parent: TypeScriptProject;

  /**
   * Location where this app can be found
   */
  public readonly appDirectory: string;

  /**
   * Name for app, without any package scope
   */
  public readonly appName: string;

  /**
   * Services this app includes.
   */
  public readonly services: Array<DataService> = [];

  /**
   * Environments we deploy this app into.
   */
  public readonly deployEnvironments: Array<AwsEnvironment> = [];

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
    this.appDirectory = outdir;
    this.appName = options.name.split("/").pop() as string;

    // init some common things we need here
    fractureProjectInit(this);

    /**
     * Add build tasks to turbo's pipeline.
     */
    const turbo = TurboRepo.of(this.parent);
    turbo.taskSets.push({
      name: this.name,
      buildTask: {
        "synth:silent": {
          cache: true,
          outputs: ["cdk.out"],
        },
      },
      testTask: {
        test: {
          cache: true,
        },
      },
    });
  }

  public deploy(
    options: Pick<DeployJobOptions, "branchPrefix" | "environment">
  ) {
    const branchPrefix = options.branchPrefix ?? "main";

    const environment = options.environment as AwsEnvironment;

    /***************************************************************************
     *
     * DEVELOPMENT TASK
     *
     * Add the ability to deploy from local dev environments to support development.
     * This task assumes that a profile exists in ~/.aws/config that matches the
     * naming convention of Integration-${accountnumber}.
     *
     **************************************************************************/

    const deployLocal = this.addTask(`deploy:local:${environment.name}`, {
      description: `Deploy to ${environment.name} from local environment`,
      receiveArgs: true,
    });

    deployLocal.exec(
      `cdk deploy *-${environment.name} --profile Integration-${environment.account} --require-approval never`
    );

    /*****************************************************************************
     *
     * WATCH TASK
     *
     * Deploy to a specific environment, then watch for changes and deploy again.
     *
     ****************************************************************************/

    const watchLocal = this.addTask(`watch:local:${environment.name}`, {
      description: `Deploy app to ${environment.name} and watch for changes`,
      receiveArgs: true,
    });

    // deploy first because surprisingly watch is not deploying first
    // see https://github.com/aws/aws-cdk/issues/17776
    watchLocal.exec(
      `cdk deploy *-${environment.name} --profile Integration-${environment.account} --require-approval never`
    );
    watchLocal.exec(
      `cdk watch *-${environment.name} --profile Integration-${environment.account}`
    );

    /*****************************************************************************
     *
     * ADD TO WORKFLOW
     *
     * Add to the workflow for deployments.
     *
     ****************************************************************************/

    // add environment to this app
    this.deployEnvironments.push(environment as AwsEnvironment);

    // add to deployment workflow
    return Workflow.deploy(this.parent).addDeployJob({
      ...options,
      branchPrefix,
      appName: this.appName,
      deploySteps: [
        {
          name: "deploy",
          run: `npx aws-cdk deploy --require-approval never --app ${this.artifactsDirectory} *-${environment.name}`,
        },
      ],
      artifactsDirectory: this.artifactsDirectory,
    });
  }

  public addService(service: DataService) {
    // add service to this app
    this.services.push(service);
    this.addDeps(service.name);
    return service;
  }

  /*****************************************************************************
   * Configuration export for this app
   ****************************************************************************/

  public config(): Record<string, any> {
    return {
      name: this.name,
      appDirectory: this.appDirectory,
      appName: this.appName,
      environments: this.deployEnvironments.map((e) => e.config()),
      services: this.services.map((s) => s.config()),
    };
  }
}
