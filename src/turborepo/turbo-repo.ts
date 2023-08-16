import { Component, JsonFile, Task } from "projen";
import { Fracture } from "../core";

export interface TurboRepoOptions {}

export class TurboRepo extends Component {
  /**
   * Returns the `TurboRepo` component of a project or `undefined` if the project
   * does not have a TurboRepo component.
   */
  public static of(fracture: Fracture): TurboRepo | undefined {
    const isTurboRepo = (c: Component): c is TurboRepo =>
      c instanceof TurboRepo;
    return fracture.components.find(isTurboRepo);
  }

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

  // @ts-ignore
  constructor(fracture: Fracture, options: TurboRepoOptions = {}) {
    super(fracture);

    fracture.addGitIgnore(".turbo");
    fracture.npmignore!.exclude(".turbo");
    fracture.npmignore!.exclude("turbo.json");

    /***************************************************************************
     *
     * PROJEN DEFAULTS
     *
     **************************************************************************/

    // add eslint to default task so we get nice clean generated files
    // fracture.defaultTask?.exec(`pnpm turbo eslint`);

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

    // lint before we test to clean up generated files even when tests fail
    // linting happens agani after testing but whatever
    // this.buildTask.exec(`pnpm turbo eslint`);

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
          eslint: {
            dependsOn: ["^eslint"],
            cache: false,
          },
          synth: {
            dependsOn: ["^synth"],
            outputs: ["cdk-out/**"],
            outputMode: "new-only",
          },
          test: {
            dependsOn: ["^test"],
            outputs: ["coverage**", "test-reports/**"],
            outputMode: "new-only",
          },
        },
      },
    });
  }
}
