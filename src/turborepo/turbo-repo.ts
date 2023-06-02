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

/**
 *
"steps": [
        {
          "spawn": "default"
        },
        {
          "spawn": "pre-compile"
        },
        {
          "spawn": "compile"
        },
        {
          "spawn": "post-compile"
        },
        {
          "spawn": "test"
        },
        {
          "spawn": "package"
        }
      ]

 *
 */

/*
{
  "$schema": "https://turborepo.org/schema.json",
  "baseBranch": "origin/main",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "@motorsportreg/gec-widget": {
      "dependsOn": [
          "@motorsportreg/core-api#build"
        ],
      "outputs": ["dist/**"]
    },
    "@motorsportreg/common-core#build": {
      "dependsOn": [
        "@motorsportreg/config-cdk#build",
        "@motorsportreg/constructs#build"
      ],
      "outputs": ["dist/**"]
    },
    "clean": {
      "cache": false
    },
    "synth": {
      "dependsOn": ["synth-prod-us-east", "synth-prod-us-west"]
    },
    "synth-sandbox-us-east": {
      "dependsOn": [],
      "outputs": ["cdk.out/sandbox-us-east/**"]
    },
    "synth-sandbox-us-west": {
      "dependsOn": [],
      "outputs": ["cdk.out/sandbox-us-west/**"]
    },
    "synth-dev-us-east": {
      "dependsOn": ["synth-sandbox-us-east", "synth-sandbox-us-west"],
      "outputs": ["cdk.out/dev-us-east/**"]
    },
    "synth-dev-us-west": {
      "dependsOn": ["synth-sandbox-us-east", "synth-sandbox-us-west"],
      "outputs": ["cdk.out/dev-us-west/**"]
    },
    "synth-preprod-us-east": {
      "dependsOn": ["synth-dev-us-east", "synth-dev-us-west"],
      "outputs": ["cdk.out/preprod-us-east/**"]
    },
    "synth-preprod-us-west": {
      "dependsOn": ["synth-dev-us-east", "synth-dev-us-west"],
      "outputs": ["cdk.out/preprod-us-west/**"]
    },
    "synth-prod-us-east": {
      "dependsOn": ["synth-preprod-us-east", "synth-preprod-us-west"],
      "outputs": ["cdk.out/prod-us-east/**"]
    },
    "synth-prod-us-west": {
      "dependsOn": ["synth-preprod-us-east", "synth-preprod-us-west"],
      "outputs": ["cdk.out/prod-us-west/**"]
    },
    "test:unit": {
      "inputs": ["/*.ts"],
      "dependsOn": ["^test:unit"],
      "outputs": ["coverage/**", "junit.xml"]
    },
    "test:unit:update_snapshots": {
      "inputs": ["/*.ts"],
      "dependsOn": ["^test:unit:update_snapshots"]
    }
  },
  "globalEnv": ["BUILD_SOURCEBRANCH", "SYSTEM_PULLREQUEST_PULLREQUESTID"]
}

*/
