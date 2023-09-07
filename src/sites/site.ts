import { join } from "path";
import {
  FractureSubProject,
  FractureSubProjectOptions,
} from "../fracture-project";
import { Settings } from "../settings";
import { TurboRepo } from "../turborepo";

export type SiteOptions = FractureSubProjectOptions;

export class Site extends FractureSubProject {
  constructor(options: SiteOptions) {
    // All services must have a parent project.
    if (!options.parent) {
      throw new Error("all services must have a parent project");
    }

    // grab settings from parent project
    const { siteRoot } = Settings.of(options.parent);

    // make sure sites is configured as a workspace
    TurboRepo.of(options.parent).addWorkspaceRoot(siteRoot);

    // set up the outdir
    const outdir = join(siteRoot, options.name);
    const artifactsDirectory = join(
      outdir,
      options.artifactsDirectory ?? "dist"
    );

    super({
      ...options,
      outdir,
      artifactsDirectory,
    });
  }
}
