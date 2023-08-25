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
   * Linting Task.
   */
  public readonly lintTask: Task;
  /**
   * Test Task
   */
  public readonly testTask: Task;
  /**
   * Synthesizes your app.
   */
  //public readonly synthTask: Task;
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

    fracture.addDevDeps("turbo");

    /***************************************************************************
     *
     * LINTING
     *
     * Make sure we lint across all workspaces, the default task runs when
     * "npx projen default" (aka: "pj") is run. Default is also the first
     * step in the full "npx projen build" command.
     *
     **************************************************************************/

    this.lintTask = fracture.addTask("turbo:eslint", {
      description: "Lint all repos",
      exec: "pnpm turbo eslint",
    });
    fracture.defaultTask?.spawn(this.lintTask);

    /***************************************************************************
     *
     * TESTING
     *
     * Replace the testing step with our own step that runs turbo test.
     *
     **************************************************************************/

    this.testTask = fracture.addTask("turbo:test", {
      description: "Lint all repos",
      exec: "pnpm turbo test",
    });
    fracture.testTask.reset();
    fracture.testTask.spawn(this.testTask);

    /***************************************************************************
     *
     * PACKAGE
     *
     * Package up all the artifacts for later deployment steps.
     *
     **************************************************************************/

    //fracture.packageTask.exec("pnpm turbo package");

    /***************************************************************************
     *
     * MAIN BUILD PIPELINE
     *
     * The steps defined here happen regardless of which pipeline is running.
     * This includes building and synth for all apps and services across any
     * environments they will be deployed into.
     *
     **************************************************************************/

    //fracture.postCompileTask?.spawn(this.lintTask);

    // this.buildTask = fracture.addTask("turbo:build", {
    //   description: "Build using turborepo.",
    // });

    // // synths all projen files into their respedtive directories
    // this.buildTask.exec(`pnpm turbo default`);

    // // build all typescript. This step is sort of redundant but a good type
    // // check anyway so leaving it for now.
    // this.buildTask.exec(`pnpm turbo compile`);

    // // lint before we test to clean up generated files even when tests fail
    // // linting happens agani after testing but whatever
    // this.buildTask.exec(`pnpm turbo eslint`);

    // // run all tests
    // this.buildTask.exec(`pnpm turbo test`);

    // // synth all cdk cloud assembly
    // this.buildTask.exec(`pnpm turbo synth`);

    /***************************************************************************
     *
     * SYNTH TASK
     *
     * We want to synth all workspaces and packages during the build task's
     * postComkpile step.
     *
     **************************************************************************/

    fracture.addTask("synth", {
      description: "Synthesizes your cdk app into cdk.out",
      exec: "pnpm turbo synth",
    });

    const synthSilentTask = fracture.addTask("synth:silent", {
      description: "Synthesizes your cdk app into cdk.out",
      exec: "pnpm turbo synth:silent",
    });
    fracture.postCompileTask?.spawn(synthSilentTask);

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
          ["synth:silent"]: {
            dependsOn: ["^synth:silent"],
            outputs: ["cdk-out/**"],
            outputMode: "new-only",
          },
          test: {
            dependsOn: ["^test"],
            outputs: ["coverage**", "test-reports/**", "**/__snapshots__/**"],
            outputMode: "new-only",
          },
        },
      },
    });
  }
}
