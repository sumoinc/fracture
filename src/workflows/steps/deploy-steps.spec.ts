import { NodeProject } from "projen/lib/javascript";
import { renderDeploySteps } from "./deploy-steps";
import { DeployJob } from "../jobs/deploy-job";
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
      artifactDirectories: ["some/other/folder/cdk.out"],
      deployTask,
    });
    const deploySteps = renderDeploySteps(deployJob);
    expect(deploySteps).toBeTruthy();
    expect(deploySteps).toMatchSnapshot();
    // console.log(buildSteps);
  });

  test("With OIDC Configuration test", () => {
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
      artifactDirectories: ["some/other/folder/cdk.out"],
      deployTask,
      awsOidcCredentials: {
        roleToAssume: "foo",
        awsRegion: "us-east-1",
        roleDurationSeconds: 900,
      },
    });
    const deploySteps = renderDeploySteps(deployJob);
    expect(deploySteps).toBeTruthy();
    expect(deploySteps).toMatchSnapshot();
    // console.log(deploySteps);
  });
});
