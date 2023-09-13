import { JobStep } from "projen/lib/github/workflows-model";
import { TypeScriptProject } from "projen/lib/typescript";
import { renderUploadArtifactSteps } from "./upload-artifact-steps";
import { Environment } from "../../environments";
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
    const workflow = Workflow.deploy(project);
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
    const environment = new Environment(project, {
      name: "my-environment",
    });
    const workflow = Workflow.deploy(project);
    workflow.addDeployJob({
      appName: "my-app",
      deploySteps,
      environment,
      artifactsDirectory: "foo",
    });
    const artifactSteps = renderUploadArtifactSteps(workflow.buildJob);
    expect(artifactSteps).toBeTruthy();
    expect(artifactSteps).toMatchSnapshot();
    // console.log(artifactSteps);
  });
});
