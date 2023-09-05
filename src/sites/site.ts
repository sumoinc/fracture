import { join } from "path";
import { NodeProject, NodeProjectOptions } from "projen/lib/javascript";
import { Settings } from "../core/fracture-settings";
import { FractureProject } from "../fracture-project";
import { TurboRepo } from "../turborepo";

export class Site extends FractureProject {
  /**
   * The directory containing distributable assets for this site.
   */
  public distDirectory: string;

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

    // this will be wrong in many cases but setting it just so there is some default.
    this.distDirectory = join(outdir, "dist");
  }
}
