import { join } from "path";
import { NodeProject, NodeProjectOptions } from "projen/lib/javascript";
import { Environment } from "../core";
import { Settings } from "../core/fracture-settings";
import { FractureProject } from "../fracture-project";
import { TurboRepo } from "../turborepo";

export class Site extends FractureProject {
  constructor(
    public readonly parent: NodeProject,
    options: NodeProjectOptions
  ) {
    // grab settings from parent project
    const { siteRoot } = Settings.of(parent);

    // make sure sites is configured as a workspace
    TurboRepo.of(parent).addWorkspaceRoot(siteRoot);

    super(parent, {
      ...options,
      outdir: join(siteRoot, options.name),
    });
  }

  public deployToAws(environment: Environment) {
    console.log(environment.name);

    // build hosting app / stacks

    // const deployWorkflow = DeploymentWorkflow.of(this.parent);
    return true;
  }
}
