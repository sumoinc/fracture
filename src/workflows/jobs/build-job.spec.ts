import { TypeScriptProject } from "projen/lib/typescript";
import { BuildJob } from "./build-job";
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
    const buildJob = new BuildJob(workflow);
    expect(buildJob).toBeTruthy();
    expect(buildJob.render()).toMatchSnapshot();
    // console.log(buildJob.render());
  });

  test("With two Deploy artifacts", () => {
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
    new DeployJob(workflow, {
      artifactDirectories: ["dist", "some/other/folder"],
      deployTask,
      authProvider,
    });
    expect(workflow.buildJob).toBeTruthy();
    expect(workflow.buildJob.render()).toMatchSnapshot();
    // console.log(JSON.stringify(workflow.buildJob.render(), null, 2));
  });
});
