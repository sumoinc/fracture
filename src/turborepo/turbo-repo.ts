import { Component, JsonFile, Task } from "projen";
import { Fracture } from "../core";

export const TURBO_BUILD_COMMAND = "turbo:build";
export const TURBO_SYNTH_COMMAND = "turbo:synth";
export const TURBO_UPGRADE_COMMAND = "turbo:upgrade";

export class TurboRepo extends Component {
  /**
   * Make this static so it can be called by projen when building other
   * dependancies.
   *
   * @param fracture
   * @returns
   */
  /*
  public static buildTask(fracture: Fracture) {
    const maybeTask = fracture.tasks.tryFind(TURBO_BUILD_COMMAND);

    if (maybeTask) {
      return maybeTask;
    }

    const task = fracture.addTask(TURBO_BUILD_COMMAND, {
      description: "Build using turborepo.",
    });

    task.exec(`pnpm turbo default`);
    task.exec(`pnpm turbo package`);
    return task;
  }
  */

  /**
   * Make this static so it can be called by projen when building other
   * dependancies.
   *
   * @param fracture
   * @returns
   */
  /*
  public static synthTask(fracture: Fracture) {
    const maybeTask = fracture.tasks.tryFind(TURBO_SYNTH_COMMAND);

    if (maybeTask) {
      return maybeTask;
    }

    const task = fracture.addTask(TURBO_SYNTH_COMMAND, {
      description: "Synth all Cloud Assembly.",
    });
    task.exec(`pnpm turbo synth`);

    return task;
  }
  */

  public fracture: Fracture;

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

    this.fracture = fracture;

    fracture.addGitIgnore(".turbo");
    fracture.npmignore!.exclude(".turbo");
    fracture.npmignore!.exclude("turbo.json");

    /**
     * upgrade entire monorepo
     */
    /*
    const upgradeTask = fracture.addTask(TURBO_UPGRADE_COMMAND, {
      description: "Upgrade all projects.",
    });
    upgradeTask.exec(`pnpm run upgrade`);
    upgradeTask.exec(`pnpm turbo upgrade`);
    */

    /***************************************************************************
     *
     * MAIN BUILD PIPELINE
     *
     **************************************************************************/

    this.buildTask = fracture.addTask("turbo:build", {
      description: "Build using turborepo.",
    });

    // synths all projen files into their respedtive directories
    this.buildTask.exec(`pnpm turbo default`);

    // pre-compile activities
    this.buildTask.exec(`pnpm turbo pre-compile`);

    // build all typescript. This step is sort of redundant but a good type
    // check anyway so leaving it for now.
    this.buildTask.exec(`pnpm turbo compile`);

    // post-compile activities
    this.buildTask.exec(`pnpm turbo post-compile`);

    // run all tests
    this.buildTask.exec(`pnpm turbo test`);

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
  }

  /**
   * Build the file.
   *
   * Call this when you've configured everything, prior to preSynthesize.
   *
   * @returns void
   */
  public build() {
    const targets = this.fracture.services
      .map((s) => s.name)
      .concat(this.fracture.apps.map((a) => a.name));

    new JsonFile(this.project, "turbo.json", {
      obj: {
        $schema: "https://turborepo.org/schema.json",
        pipeline: {
          "//#default": {
            cache: false,
          },
          "pre-compile": {
            dependsOn: ["^pre-compile"],
            cache: false,
          },
          compile: {
            dependsOn: ["^compile"],
            outputs: ["dist/**", "lib/**"],
            outputMode: "new-only",
          },
          "post-compile": {
            dependsOn: ["^post-compile"],
            cache: false,
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
          upgrade: {
            dependsOn: [`${targets[0]}#upgrade`],
            cache: false,
          },
          ...targets.reduce((acc, target, idx) => {
            return {
              [`${target}#upgrade`]: {
                dependsOn:
                  idx < targets.length - 1
                    ? [`${targets[idx + 1]}#upgrade`]
                    : [],
                cache: false,
              },
              ...acc,
            };
          }, {}),
        },
      },
    });
  }
}
