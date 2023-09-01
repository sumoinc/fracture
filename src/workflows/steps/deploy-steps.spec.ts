import { TypeScriptProject } from "projen/lib/typescript";
import { renderDeploySteps } from "./deploy-steps";
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
    const deployTask = project.addTask("cdk:deploy", {
      description: "Deploy the service",
      exec: "echo 'deploying'",
    });
    const authProvider = new AuthProvider(project, {
      authProviderType: AuthProviderType.AWS_GITHUB_OIDC,
      awsCredentialsOidc: {
        roleToAssume: "foo",
        roleDurationSeconds: 900,
        awsRegion: "us-east-1",
      },
    });
    const deployJob = new DeployJob(workflow, {
      artifactDirectories: ["some/other/folder/cdk.out"],
      deployTask,
      authProvider,
    });
    const deploySteps = renderDeploySteps(deployJob);
    expect(deploySteps).toBeTruthy();
    expect(deploySteps).toMatchSnapshot();
    // console.log(buildSteps);
  });

  test("With OIDC Configuration test", () => {
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
      authProviderType: AuthProviderType.AWS_GITHUB_OIDC,
      awsCredentialsOidc: {
        roleToAssume: "foo",
        roleDurationSeconds: 900,
        awsRegion: "us-east-1",
      },
    });
    const deployJob = new DeployJob(workflow, {
      artifactDirectories: ["some/other/folder/cdk.out"],
      deployTask,
      authProvider,
    });
    const deploySteps = renderDeploySteps(deployJob);
    expect(deploySteps).toBeTruthy();
    expect(deploySteps).toMatchSnapshot();
    // console.log(deploySteps);
  });
});
