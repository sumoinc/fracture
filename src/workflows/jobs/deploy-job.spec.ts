import { TypeScriptProject } from "projen/lib/typescript";
import { DeployJob } from "./deploy-job";
import { AuthProvider, AuthProviderType } from "../auth-provider";
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
      authProviderType: AuthProviderType.GITHUB_OIDC,
      credentialsOidc: {
        roleToAssume: "foo",
        roleDurationSeconds: 900,
        awsRegion: "us-east-1",
      },
    });
    const deployJob = new DeployJob(workflow, {
      deployTask,
      authProvider,
    });
    expect(deployJob).toBeTruthy();
    expect(deployJob.render()).toMatchSnapshot();
    // console.log(deployJob.render());
  });

  test("Two deploys depend on each other", () => {
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
    const deployJobOne = new DeployJob(workflow, {
      name: "Deploy Service One",
      deployTask,
      authProvider,
    });
    const deployJobTwo = new DeployJob(workflow, {
      name: "Deploy Service Two",
      deployTask,
      authProvider,
    });
    deployJobTwo.dependsOn(deployJobOne);
    expect(deployJobOne).toBeTruthy();
    expect(deployJobOne.render()).toMatchSnapshot();
    expect(deployJobTwo).toBeTruthy();
    expect(deployJobTwo.render()).toMatchSnapshot();
    // console.log(deployJobOne.jobId, deployJobOne.render());
    // console.log(deployJobTwo.jobId, deployJobTwo.render());
  });

  test("Deploy with artifacts", () => {
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
    const deployJob = new DeployJob(workflow, {
      name: "Deploy Service Foo",
      artifactDirectories: ["foo", "bar"],
      deployTask,
      authProvider,
    });
    expect(deployJob).toBeTruthy();
    expect(deployJob.render()).toMatchSnapshot();
    // console.log(JSON.stringify(deployJob.render(), null, 2));
  });
});
