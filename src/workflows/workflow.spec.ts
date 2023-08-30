import { TypeScriptProject } from "projen/lib/typescript";
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
    workflow.addDeployJob({
      name: "Deploy Service Foo",
      artifactDirectories: ["foo"],
      deployTask,
      awsOidcCredentials: {
        roleToAssume: "foo",
        awsRegion: "us-east-1",
        roleDurationSeconds: 900,
      },
    });
    const content = synthFile(project, `.github/workflows/my-workflow.yml`);
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });
});
