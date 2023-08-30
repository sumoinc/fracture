import { TypeScriptProject } from "projen/lib/typescript";
import { BuildJob } from "./build-job";
import { DeployJob } from "./deploy-job";
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
    new DeployJob(workflow, {
      artifactDirectories: ["dist", "some/other/folder"],
      deployTask,
    });
    expect(workflow.buildJob).toBeTruthy();
    expect(workflow.buildJob.render()).toMatchSnapshot();
    // console.log(JSON.stringify(workflow.buildJob.render(), null, 2));
  });
});
