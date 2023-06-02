import { Component, JsonFile } from "projen";
import { FractureProject } from "../core";

export class TurboRepo extends Component {
  constructor(fractureProject: FractureProject) {
    super(fractureProject);

    fractureProject.addGitIgnore(".turbo");
    fractureProject.npmignore!.exclude(".turbo");
    fractureProject.npmignore!.exclude("turbo.json");

    new JsonFile(this.project, "turbo.json", {
      obj: {
        $schema: "https://turborepo.org/schema.json",
        baseBranch: "origin/main",
        pipeline: {
          default: {
            dependsOn: ["^default"],
            outputs: ["src/**"],
          },
          compile: {
            dependsOn: ["^compile"],
            outputs: ["dist/**", "lib/**", "coverage**", "test-reports/**"],
          },
        },
      },
    });
  }
}

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
