import { TypeScriptProject } from "projen/lib/typescript";
import { renderUploadArtifactSteps } from "./upload-artifact-steps";
import { AuthProvider, AuthProviderType } from "../auth-provider";
import { DeployJob } from "../jobs/deploy-job";
import { Workflow } from "../workflow";

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
    const deployTask = project.addTask("cdk:deploy", {
      description: "Deploy the service",
      exec: "echo 'deploying'",
    });
    const authProvider = new AuthProvider(project, {
      authProviderType: AuthProviderType.GITHUB_OIDC,
      credentialsOidc: {
        roleToAssume: "foo",
        roleDurationSeconds: 900,
        awsRegion: "us-east-1",
      },
    });
    new DeployJob(workflow, {
      artifactDirectories: ["dist", "some/other/folder"],
      deployTask,
      authProvider,
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
    const deployTask = project.addTask("cdk:deploy", {
      description: "Deploy the service",
      exec: "echo 'deploying'",
    });
    const authProvider = new AuthProvider(project, {
      authProviderType: AuthProviderType.GITHUB_OIDC,
      credentialsOidc: {
        roleToAssume: "foo",
        roleDurationSeconds: 900,
        awsRegion: "us-east-1",
      },
    });
    new DeployJob(workflow, {
      artifactDirectories: ["dist", "dist"],
      deployTask,
      authProvider,
    });
    const artifactSteps = renderUploadArtifactSteps(workflow.buildJob);
    expect(artifactSteps).toBeTruthy();
    expect(artifactSteps).toMatchSnapshot();
    // console.log(artifactSteps);
  });
});
