import { Component, JsonFile } from "projen";
import { Fracture } from "../core";

export const TURBO_BUILD_COMMAND = "turbo:build";
export const TURBO_SYNTH_COMMAND = "turbo:synth";
export const TURBO_DEPLOY_COMMAND = "turbo:deploy";

export class TurboRepo extends Component {
  /**
   * Makea this static so it can be called by projen when building other
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

  public fracture: Fracture;

  constructor(fracture: Fracture) {
    super(fracture);

    this.fracture = fracture;

    fracture.addGitIgnore(".turbo");
    fracture.npmignore!.exclude(".turbo");
    fracture.npmignore!.exclude("turbo.json");

    /**
     * Define synth and deploy tasks.
     */
    const synthTask = fracture.addTask(TURBO_SYNTH_COMMAND, {
      description: "Synth all Cloud Assembly.",
    });
    synthTask.exec(`pnpm turbo synth`);
  }

  /**
   * Build the file.
   *
   * Call this when you've configured everything, prior to preSynthesize.
   *
   * @returns void
   */
  public build() {
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
            dependsOn: [],
            outputs: ["cdk-out/**"],
            outputMode: "new-only",
          },
        },
      },
    });
  }
}
