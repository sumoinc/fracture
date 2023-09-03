import { JobStep } from "projen/lib/github/workflows-model";
import { TypeScriptProject } from "projen/lib/typescript";
import { renderDownloadArtifactSteps } from "./download-artifact-steps";
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
    const environment = new Environment(project, {
      name: "my-environment",
    });
    const deployJob = new DeployJob(workflow, { deploySteps, environment });
    const artifactSteps = renderDownloadArtifactSteps(deployJob);
    expect(artifactSteps).toBeTruthy();
    expect(artifactSteps).toMatchSnapshot();
    // console.log(artifactSteps);
  });

  test("With Deplopy Job", () => {
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
    const deployJob = new DeployJob(workflow, {
      artifactDirectories: ["some/other/folder/cdk.out"],
      deploySteps,
      environment,
    });
    const artifactSteps = renderDownloadArtifactSteps(deployJob);
    expect(artifactSteps).toBeTruthy();
    expect(artifactSteps).toMatchSnapshot();
    // console.log(JSON.stringify(artifactSteps, null, 2));
  });
});
