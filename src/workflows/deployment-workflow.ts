import { Component } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { Workflow } from "./workflow";

export class DeploymentWorkflow extends Workflow {
  /**
   * Returns the deployment workflow for a project or creates one if it
   * doesn't exist yet. Singleton?
   */
  public static of(project: NodeProject): DeploymentWorkflow {
    const isDefined = (c: Component): c is DeploymentWorkflow =>
      c instanceof DeploymentWorkflow;
    return (
      project.components.find(isDefined) ?? new DeploymentWorkflow(project)
    );
  }

  constructor(public readonly project: NodeProject) {
    super(project, { name: "deployment" });
  }
}
