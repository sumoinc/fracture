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

export type ServiceOptions = Omit<
  SetRequired<Partial<AwsCdkTypeScriptAppOptions>, "name">,
  "parent"
> &
  FractureSubProjectOptions;

export class Service extends AwsCdkTypeScriptApp {
  /**
   *
   */
  public readonly parent: TypeScriptProject;

  /**
   * Location where this service can be found
   */
  public readonly serviceDirectory: string;

  constructor(options: ServiceOptions) {
    // All services must have a parent project.
    if (!options.parent) {
      throw new Error("all services must have a parent project");
    }

    // grab settings from parent project
    const { defaultCdkVersion, serviceRoot } = Settings.of(options.parent);

    // make sure services is configured as a workspace
    TurboRepo.of(options.parent).addWorkspaceRoot(serviceRoot);

    // strip org scopes from folder structure, if given
    const subdir =
      options.name.split("/").length === 2
        ? options.name.split("/")[1]
        : options.name;

    // set up the outdir
    const outdir = join(serviceRoot, subdir);

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
    this.serviceDirectory = outdir;

    // init some common things we need here
    fractureProjectInit(this);

    // appsync js support
    this.addDeps("@aws-appsync/utils");
    this.addDeps("@aws-appsync/eslint-plugin");
  }

  config(): Record<string, any> {
    return {
      name: this.name,
      serviceDirectory: this.serviceDirectory,
    };
  }
}
