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

  /**
   * Make this static so it can be called by projen when building other
   * dependancies.
   *
   * @param fracture
   * @returns
   */
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

  public fracture: Fracture;

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
            dependsOn: [],
            cache: false,
          },
          compile: {
            dependsOn: ["pre-compile"],
            outputs: ["dist/**", "lib/**"],
            outputMode: "new-only",
          },
          "post-compile": {
            dependsOn: ["compile"],
            cache: false,
          },
          test: {
            dependsOn: ["compile"],
            outputs: ["coverage**", "test-reports/**"],
            outputMode: "new-only",
          },
          package: {
            dependsOn: ["test"],
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
