import { Component, Task } from "projen";
import { Fracture } from "../core";

/**
 * Adds standard AWS CDK tasks to the base
 * fracture project.
 */
export class CdkTasks extends Component {
  /**
   * Synthesizes your app.
   */
  public readonly synth: Task;

  /**
   * Synthesizes your app and suppresses stdout.
   */
  public readonly synthSilent: Task;

  /**
   * Deploys your app.
   */
  public readonly deploy: Task;

  /**
   * Destroys all the stacks.
   */
  public readonly destroy: Task;

  /**
   * Diff against production.
   */
  public readonly diff: Task;

  constructor(fracture: Fracture) {
    super(fracture);

    this.synth = fracture.addTask("turbo:synth", {
      description: "Synthesizes your cdk app into cdk.out",
      exec: "pnpm turbo awscdk:synth",
    });

    this.synthSilent = fracture.addTask("turbo:synth:silent", {
      description:
        'Synthesizes your cdk app into cdk.out and suppresses the template in stdout (part of "pnpm build")',
      exec: "pnpm turbo awscdk:synth -q",
    });

    this.deploy = fracture.addTask("turbo:deploy", {
      description: "Deploys your CDK app to the AWS cloud",
      exec: "pnpm turbo awscdk:deploy",
      receiveArgs: true,
    });

    this.destroy = fracture.addTask("turbo:destroy", {
      description: "Destroys your cdk app in the AWS cloud",
      exec: "pnpm turbo awscdk:destroy",
      receiveArgs: true,
    });

    this.diff = fracture.addTask("turbo:diff", {
      description: "Diffs the currently deployed app against your code",
      exec: "pnpm turbo awscdk:diff",
    });
  }
}
