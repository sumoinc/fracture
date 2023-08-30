import { NodeProject } from "projen/lib/javascript";

import { renderDownloadArtifactSteps } from "./download-artifact-steps";
import { DeployJob } from "../jobs/deploy-job";
import { Workflow } from "../workflow";

describe("success conditions", () => {
  test("Smoke test", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const workflow = new Workflow(project, {
      name: "my-workflow",
    });
    const deployTask = project.addTask("cdk:deploy", {
      description: "Deploy the service",
      exec: "echo 'deploying'",
    });
    const deployJob = new DeployJob(workflow, { deployTask });
    const artifactSteps = renderDownloadArtifactSteps(deployJob);
    expect(artifactSteps).toBeTruthy();
    expect(artifactSteps).toMatchSnapshot();
    // console.log(artifactSteps);
  });

  test("With Deplopy Job", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const workflow = new Workflow(project, {
      name: "my-workflow",
    });
    const deployTask = project.addTask("cdk:deploy", {
      description: "Deploy the service",
      exec: "echo 'deploying'",
    });
    const deployJob = new DeployJob(workflow, {
      artifactDirectories: ["some/other/folder/cdk.out"],
      deployTask,
    });
    const artifactSteps = renderDownloadArtifactSteps(deployJob);
    expect(artifactSteps).toBeTruthy();
    expect(artifactSteps).toMatchSnapshot();
    // console.log(JSON.stringify(artifactSteps, null, 2));
  });
});
