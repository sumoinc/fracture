import { Component, JsonFile } from "projen";
import { FractureProject } from "../core";

export class TurboRepo extends Component {
  public static buildTask(fractureProject: FractureProject) {
    const maybeTask = fractureProject.tasks.tryFind("build:turbo");

    if (maybeTask) {
      return maybeTask;
    }

    const task = fractureProject.addTask("build:turbo", {
      description: "Build using turborepo.",
    });

    task.exec(`pnpm turbo default`);
    task.exec(`pnpm turbo package`);
    return task;
  }

  public fractureProject: FractureProject;

  constructor(fractureProject: FractureProject) {
    super(fractureProject);

    this.fractureProject = fractureProject;

    fractureProject.addGitIgnore(".turbo");
    fractureProject.npmignore!.exclude(".turbo");
    fractureProject.npmignore!.exclude("turbo.json");

    /*
    this.task = fractureProject.addTask("build:turbo", {
      description: "Build using turborepo.",
    });

    this.task.exec(`pnpm turbo default`);
    this.task.exec(`pnpm turbo package`);
    */
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
          /*
          "pre-compile": {
            dependsOn: [],
            cache: false,
          },
          */
          compile: {
            //dependsOn: ["pre-compile"],
            outputs: ["dist/**", "lib/**"],
            outputMode: "new-only",
          },
          /*
          "post-compile": {
            dependsOn: ["compile"],
            cache: false,
          },
          */
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
