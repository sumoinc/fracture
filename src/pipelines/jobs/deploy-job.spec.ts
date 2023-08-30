import { NodeProject } from "projen/lib/javascript";
import { DeployJob } from "./deploy-job";
import { Workflow } from "../workflow";

describe("success conditions", () => {
  test("Smoke test", () => {
    const project = new NodeProject({
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
    const deployJob = new DeployJob(workflow, {
      deployTask,
    });
    expect(deployJob).toBeTruthy();
    expect(deployJob.render()).toMatchSnapshot();
    // console.log(deployJob.render());
  });

  test("Two deploys depend on each other", () => {
    const project = new NodeProject({
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
    const deployJobOne = new DeployJob(workflow, {
      name: "Deploy Service One",
      deployTask,
    });
    const deployJobTwo = new DeployJob(workflow, {
      name: "Deploy Service Two",
      deployTask,
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
    const project = new NodeProject({
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
    const deployJob = new DeployJob(workflow, {
      name: "Deploy Service Foo",
      artifactDirectories: ["foo", "bar"],
      deployTask,
    });
    expect(deployJob).toBeTruthy();
    expect(deployJob.render()).toMatchSnapshot();
    // console.log(JSON.stringify(deployJob.render(), null, 2));
  });
});
