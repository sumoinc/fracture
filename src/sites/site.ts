import { join } from "path";
import { NodeProject, NodeProjectOptions } from "projen/lib/javascript";
import { Settings } from "../fracture-settings";
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

    // set up the outdir
    const outdir = join(siteRoot, options.name);

    super(parent, {
      ...options,
      outdir,
    });
  }
}
