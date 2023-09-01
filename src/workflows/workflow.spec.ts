import { TypeScriptProject } from "projen/lib/typescript";
import { AuthProvider, AuthProviderType } from "./auth-provider";
import { Workflow } from "./workflow";
import { synthFile } from "../util/test-util";

describe("success conditions", () => {
  test("Smoke test", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new Workflow(project, { name: "my-workflow" });

    const content = synthFile(project, `.github/workflows/my-workflow.yml`);
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test("With deploy job", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const workflow = new Workflow(project, { name: "my-workflow" });
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
    workflow.addDeployJob({
      name: "Deploy Service Foo",
      artifactDirectories: ["foo"],
      deployTask,
      authProvider,
    });
    const content = synthFile(project, `.github/workflows/my-workflow.yml`);
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });
});
