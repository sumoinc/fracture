import { NodeProject } from "projen/lib/javascript";
import { renderUploadArtifactSteps } from "./upload-artifact-steps";
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
    const artifactSteps = renderUploadArtifactSteps(workflow.buildJob);
    expect(artifactSteps).toBeTruthy();
    expect(artifactSteps).toMatchSnapshot();
    // console.log(artifactSteps);
  });

  test("With Deploy Job", () => {
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
    new DeployJob(workflow, {
      artifactDirectories: ["dist", "some/other/folder"],
      deployTask,
    });
    const artifactSteps = renderUploadArtifactSteps(workflow.buildJob);
    expect(artifactSteps).toBeTruthy();
    expect(artifactSteps).toMatchSnapshot();
    // console.log(artifactSteps);
  });

  test("With Duplaicate paths", () => {
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
    new DeployJob(workflow, {
      artifactDirectories: ["dist", "dist"],
      deployTask,
    });
    const artifactSteps = renderUploadArtifactSteps(workflow.buildJob);
    expect(artifactSteps).toBeTruthy();
    expect(artifactSteps).toMatchSnapshot();
    // console.log(artifactSteps);
  });
});
