import {
  NodeProject,
  NodeProjectOptions,
  Prettier,
} from "projen/lib/javascript";
import { SetOptional, SetRequired } from "type-fest";
import { Environment } from "./core";
import { AuthProvider } from "./workflows/auth-provider";
import { DeploymentWorkflow } from "./workflows/deployment-workflow";

export type FractureProjectOptions = SetRequired<
  SetOptional<NodeProjectOptions, "defaultReleaseBranch">,
  "outdir"
>;

export class FractureProject extends NodeProject {
  constructor(
    public readonly parent: NodeProject,
    options: FractureProjectOptions
  ) {
    super({
      parent,
      defaultReleaseBranch: "main",
      // inherit from parent project
      license: parent.package.license,
      prettier: parent.prettier && parent.prettier instanceof Prettier,
      packageManager: parent.package.packageManager,
      pnpmVersion: parent.package.pnpmVersion,
      ...options,
    });
  }

  public deployToAws(environment: Environment) {
    // add to deployment workflow
    const deploymentWorkflow = DeploymentWorkflow.of(this.parent);

    const deployTask = this.parent.addTask(`cdk:deploy:${this.name}`, {
      description: `Deploy the ${this.name}`,
      exec: `echo 'deploying ${this.name}'`,
    });
    const authProvider = AuthProvider.fromEnvironment(this.parent, environment);

    deploymentWorkflow.addDeployJob({
      deployTask,
      authProvider,
    });

    // const deployWorkflow = DeploymentWorkflow.of(this.parent);
    return true;
  }
}
