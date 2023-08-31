import { NodeProject, NodeProjectOptions } from "projen/lib/javascript";
import { Environment } from "../core";
import { TurboRepo } from "../turborepo";
import { DeploymentWorkflow } from "../workflows/deployment-workflow";

export class Site extends NodeProject {
  constructor(
    public readonly parent: NodeProject,
    options: NodeProjectOptions
  ) {
    super({
      parent,
      ...options,
    });

    // make sure sites is configured as a workspace
    TurboRepo.of(parent).addWorkspaceRoot("sites");
  }

  public deployTo(environment: Environment) {
    if (!this.parent) {
      throw new Error("Site must have a parent project");
    }

    const deployWorkflow = DeploymentWorkflow.of(this.parent);
  }
}
