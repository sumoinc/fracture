import { JobStep } from "projen/lib/github/workflows-model";
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
    const deploySteps: Array<JobStep> = [
      {
        name: "Say foo",
        run: "echo 'foo'",
      },
    ];
    const authProvider = new AuthProvider(project, {
      authProviderType: AuthProviderType.AWS_GITHUB_OIDC,
      awsCredentialsOidc: {
        roleToAssume: "foo",
        roleDurationSeconds: 900,
        awsRegion: "us-east-1",
      },
    });
    const deployJob = new DeployJob(workflow, {
      deploySteps,
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
    const deploySteps: Array<JobStep> = [
      {
        name: "Say foo",
        run: "echo 'foo'",
      },
    ];
    const authProvider = new AuthProvider(project, {
      authProviderType: AuthProviderType.AWS_GITHUB_OIDC,
      awsCredentialsOidc: {
        roleToAssume: "foo",
        roleDurationSeconds: 900,
        awsRegion: "us-east-1",
      },
    });
    const deployJobOne = new DeployJob(workflow, {
      name: "Deploy Service One",
      deploySteps,
      authProvider,
    });
    const deployJobTwo = new DeployJob(workflow, {
      name: "Deploy Service Two",
      deploySteps,
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
    const deploySteps: Array<JobStep> = [
      {
        name: "Say foo",
        run: "echo 'foo'",
      },
    ];
    const authProvider = new AuthProvider(project, {
      authProviderType: AuthProviderType.AWS_GITHUB_OIDC,
      awsCredentialsOidc: {
        roleToAssume: "foo",
        roleDurationSeconds: 900,
        awsRegion: "us-east-1",
      },
    });
    const deployJob = new DeployJob(workflow, {
      name: "Deploy Service Foo",
      artifactDirectories: ["foo", "bar"],
      deploySteps,
      authProvider,
    });
    expect(deployJob).toBeTruthy();
    expect(deployJob.render()).toMatchSnapshot();
    // console.log(JSON.stringify(deployJob.render(), null, 2));
  });
});
