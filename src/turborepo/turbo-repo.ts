import { Component, JsonFile } from "projen";
import { Fracture } from "../core";

export const TURBO_BUILD_COMMAND = "turbo:build";

export class TurboRepo extends Component {
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
        },
      },
    });
  }
}
