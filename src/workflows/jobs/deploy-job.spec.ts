import { JobStep } from "projen/lib/github/workflows-model";
import { TypeScriptProject } from "projen/lib/typescript";
import { DeployJob } from "./deploy-job";
import { AwsEnvironment } from "../../environments";
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
    const environment = new AwsEnvironment(project, {
      name: "my-environment",
      accountNumber: "0000000000",
    });
    const deployJob = new DeployJob(workflow, {
      deploySteps,
      environment,
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
    const environment = new AwsEnvironment(project, {
      name: "my-environment",
      accountNumber: "0000000000",
    });
    const deployJobOne = new DeployJob(workflow, {
      name: "Deploy Service One",
      deploySteps,
      environment,
    });
    const deployJobTwo = new DeployJob(workflow, {
      name: "Deploy Service Two",
      deploySteps,
      environment,
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
    const environment = new AwsEnvironment(project, {
      name: "my-environment",
      accountNumber: "0000000000",
    });
    const deployJob = new DeployJob(workflow, {
      name: "Deploy Service Foo",
      artifactDirectories: ["foo", "bar"],
      deploySteps,
      environment,
    });
    expect(deployJob).toBeTruthy();
    expect(deployJob.render()).toMatchSnapshot();
    // console.log(JSON.stringify(deployJob.render(), null, 2));
  });
});
