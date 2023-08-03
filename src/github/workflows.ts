import { Component } from "projen";
import { Fracture } from "../core";

export class Workflows extends Component {
  /*
  private readonly featureWorkflow: DeploymentWorkflow;
  private readonly prWorkflow: DeploymentWorkflow;
  private readonly mainWorkflow: DeploymentWorkflow;
  */

  constructor(project: Fracture) {
    super(project);

    /*
    new DeploymentWorkflow(project, {
      name: "deploy-feature",
    });

    new DeploymentWorkflow(project, {
      name: "deploy-pr",
    });

    new DeploymentWorkflow(project, {
      name: "deploy-main",
    });
    */
  }
}
