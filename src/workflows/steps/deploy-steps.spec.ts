import { JobStep } from "projen/lib/github/workflows-model";
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
      artifactDirectories: ["some/other/folder/cdk.out"],
      deploySteps,
      authProvider,
    });
    const outputSteps = renderDeploySteps(deployJob);
    expect(outputSteps).toBeTruthy();
    expect(outputSteps).toMatchSnapshot();
    // console.log(outputSteps);
  });

  test("With OIDC Configuration test", () => {
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
      artifactDirectories: ["some/other/folder/cdk.out"],
      deploySteps,
      authProvider,
    });
    const outputSteps = renderDeploySteps(deployJob);
    expect(outputSteps).toBeTruthy();
    expect(outputSteps).toMatchSnapshot();
    // console.log(outputSteps);
  });
});
