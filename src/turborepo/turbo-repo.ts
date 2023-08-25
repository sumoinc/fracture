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
