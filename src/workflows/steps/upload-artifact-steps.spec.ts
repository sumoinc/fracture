import { JobStep } from "projen/lib/github/workflows-model";
import { TypeScriptProject } from "projen/lib/typescript";
import { renderUploadArtifactSteps } from "./upload-artifact-steps";
import { Environment } from "../../environments";
import { DeployJob } from "../jobs/deploy-job";
import { Workflow } from "../workflow";

const deploySteps: Array<JobStep> = [
  {
    name: "Say foo",
    run: "echo 'foo'",
  },
];

describe("success conditions", () => {
  test("Smoke test", () => {
    const project = new TypeScriptProject({
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
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const workflow = new Workflow(project, {
      name: "my-workflow",
    });
    const environment = new Environment(project, {
      name: "my-environment",
    });
    new DeployJob(workflow, {
      artifactDirectories: ["dist", "some/other/folder"],
      deploySteps,
      environment,
    });
    const artifactSteps = renderUploadArtifactSteps(workflow.buildJob);
    expect(artifactSteps).toBeTruthy();
    expect(artifactSteps).toMatchSnapshot();
    // console.log(artifactSteps);
  });

  test("With Duplaicate paths", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const workflow = new Workflow(project, {
      name: "my-workflow",
    });
    const environment = new Environment(project, {
      name: "my-environment",
    });
    new DeployJob(workflow, {
      artifactDirectories: ["dist", "dist"],
      deploySteps,
      environment,
    });
    const artifactSteps = renderUploadArtifactSteps(workflow.buildJob);
    expect(artifactSteps).toBeTruthy();
    expect(artifactSteps).toMatchSnapshot();
    // console.log(artifactSteps);
  });
});
