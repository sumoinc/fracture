import { Component, JsonFile, Task } from "projen";
import { Fracture } from "../core";

export class TurboRepo extends Component {
  /**
   * Synthesizes your app.
   */
  public readonly buildTask: Task;

  /**
   * Synthesizes your app.
   */
  public readonly synthTask: Task;

  /**
   * Deploys your app.
   */
  public readonly deployTask: Task;

  /**
   * Destroys all the stacks.
   */
  public readonly destroyTask: Task;

  /**
   * Diff against production.
   */
  public readonly diffTask: Task;

  constructor(fracture: Fracture) {
    super(fracture);

    fracture.addGitIgnore(".turbo");
    fracture.npmignore!.exclude(".turbo");
    fracture.npmignore!.exclude("turbo.json");

    /***************************************************************************
     *
     * MAIN BUILD PIPELINE
     *
     * The steps defined here happen regardless of which pipeline is running.
     * This includes building and synth for all apps and services across any
     * environments they will be deployed into.
     *
     **************************************************************************/

    this.buildTask = fracture.addTask("turbo:build", {
      description: "Build using turborepo.",
    });

    // synths all projen files into their respedtive directories
    this.buildTask.exec(`pnpm turbo default`);

    // build all typescript. This step is sort of redundant but a good type
    // check anyway so leaving it for now.
    this.buildTask.exec(`pnpm turbo compile`);

    // run all tests
    this.buildTask.exec(`pnpm turbo test`);

    // synth all cdk cloud assembly
    this.buildTask.exec(`pnpm turbo synth`);

    /***************************************************************************
     *
     * CDK TASKS
     *
     **************************************************************************/

    this.synthTask = fracture.addTask("turbo:synth", {
      description: "Synthesizes your cdk app into cdk.out",
      exec: "pnpm turbo synth",
    });

    this.deployTask = fracture.addTask("turbo:deploy", {
      description: "Deploys your CDK app to the AWS cloud",
      exec: "pnpm turbo deploy",
      receiveArgs: true,
    });

    this.destroyTask = fracture.addTask("turbo:destroy", {
      description: "Destroys your cdk app in the AWS cloud",
      exec: "pnpm turbo destroy",
      receiveArgs: true,
    });

    this.diffTask = fracture.addTask("turbo:diff", {
      description: "Diffs the currently deployed app against your code",
      exec: "pnpm turbo diff",
    });

    /***************************************************************************
     *
     * DECLARE ROOT BUILDFILE
     *
     **************************************************************************/
    new JsonFile(this.project, "turbo.json", {
      obj: {
        $schema: "https://turborepo.org/schema.json",
        pipeline: {
          "//#default": {
            cache: false,
          },
          compile: {
            dependsOn: ["^compile"],
            outputs: ["dist/**", "lib/**"],
            outputMode: "new-only",
          },
          test: {
            dependsOn: ["^test"],
            outputs: ["coverage**", "test-reports/**"],
            outputMode: "new-only",
          },
          synth: {
            dependsOn: ["^synth"],
            outputs: ["cdk-out/**"],
            outputMode: "new-only",
          },
        },
      },
    });
  }
}
