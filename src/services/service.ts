import { join } from "path";
import {
  AwsCdkTypeScriptApp,
  AwsCdkTypeScriptAppOptions,
} from "projen/lib/awscdk";
import { NodeProject } from "projen/lib/javascript";
import { SetRequired } from "type-fest";
import { fractureProjectOptions } from "../fracture-project";
import { Settings } from "../settings";
import { TurboRepo } from "../turborepo";

export interface ServiceOptions
  extends SetRequired<Partial<AwsCdkTypeScriptAppOptions>, "name"> {}

export class Service extends AwsCdkTypeScriptApp {
  constructor(public readonly parent: NodeProject, options: ServiceOptions) {
    // grab settings from parent project
    const { defaultCdkVersion, serviceRoot } = Settings.of(parent);

    // make sure services is configured as a workspace
    TurboRepo.of(parent).addWorkspaceRoot(serviceRoot);

    // set up the outdir
    const outdir = join(serviceRoot, options.name);

    // merg with fracture global settings
    const mergedOptions = fractureProjectOptions(parent, {
      ...options,
      outdir,
    });

    super({
      cdkVersion: defaultCdkVersion,
      ...mergedOptions,
      parent,
      artifactsDirectory: join(outdir, "cdk.out"),
    });
  }
}
