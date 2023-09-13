import { JobStep } from "projen/lib/github/workflows-model";
import { TypeScriptProject } from "projen/lib/typescript";
import { DeployJob } from "./deploy-job";
import { AwsEnvironment } from "../../environments";

describe("success conditions", () => {
  test("Smoke test", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
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
    const deployJob = new DeployJob(project, {
      appName: "my-app",
      deploySteps,
      environment,
      artifactsDirectory: "foo",
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
    const deployJobOne = new DeployJob(project, {
      appName: "App One",
      deploySteps,
      environment,
      artifactsDirectory: "foo",
    });
    const deployJobTwo = new DeployJob(project, {
      appName: "App Two",
      deploySteps,
      environment,
      artifactsDirectory: "bar",
    });
    deployJobTwo.dependsOn(deployJobOne);
    expect(deployJobOne).toBeTruthy();
    expect(deployJobOne.render()).toMatchSnapshot();
    expect(deployJobTwo).toBeTruthy();
    expect(deployJobTwo.render()).toMatchSnapshot();
    // console.log(deployJobOne.jobId, deployJobOne.render());
    // console.log(deployJobTwo.jobId, deployJobTwo.render());
  });
});
