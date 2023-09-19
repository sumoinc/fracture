import { JobStep } from "projen/lib/github/workflows-model";
import { TypeScriptProject } from "projen/lib/typescript";
import { Workflow } from "./workflow";
import { AwsEnvironment } from "../environments";
import { synthFile } from "../util/test-util";

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
    const environment = new AwsEnvironment(project, {
      name: "my-environment",
      account: "0000000000",
    });
    Workflow.deploy(project).addDeployJob({
      appName: "my-app",
      artifactsDirectory: "foo",
      deploySteps,
      environment,
    });
    const content = synthFile(project, `.github/workflows/deploy.yml`);
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });
});
