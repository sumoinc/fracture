import { join } from "path";
import { NodeProject, NodeProjectOptions } from "projen/lib/javascript";
import { Settings } from "../fracture-settings";
import { FractureProject } from "../fracture-project";
import { TurboRepo } from "../turborepo";

export class App extends FractureProject {
  constructor(public readonly root: NodeProject, options: NodeProjectOptions) {
    // grab settings from root project
    const { appRoot } = Settings.of(root);

    // make sure sites is configured as a workspace
    TurboRepo.of(root).addWorkspaceRoot(appRoot);

    super(root, {
      outdir: join(appRoot, options.name),
      ...options,
    });
  }
}
