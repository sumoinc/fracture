import { JobStep } from "projen/lib/github/workflows-model";
import { TypeScriptProject } from "projen/lib/typescript";
import { BuildJob } from "./build-job";
import { DeployJob } from "./deploy-job";
import { AwsEnvironment } from "../../environments";
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
    const environment = new AwsEnvironment(project, {
      name: "my-environment",
      accountNumber: "0000000000",
    });
    new DeployJob(workflow, {
      artifactDirectories: ["dist", "some/other/folder"],
      deploySteps,
      environment,
    });
    expect(workflow.buildJob).toBeTruthy();
    expect(workflow.buildJob.render()).toMatchSnapshot();
    // console.log(JSON.stringify(workflow.buildJob.render(), null, 2));
  });
});
