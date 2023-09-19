import { JobStep } from "projen/lib/github/workflows-model";
import { TypeScriptProject } from "projen/lib/typescript";
import { renderDeploySteps } from "./deploy-steps";
import { AwsEnvironment } from "../../environments";
import { DeployJob } from "../jobs/deploy-job";

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
    const environment = new AwsEnvironment(project, {
      name: "my-environment",
      account: "000000000000",
    });
    const deployJob = new DeployJob(project, {
      appName: "my-app",
      deploySteps,
      environment,
      artifactsDirectory: "foo",
    });
    const outputSteps = renderDeploySteps(deployJob);
    expect(outputSteps).toBeTruthy();
    expect(outputSteps).toMatchSnapshot();
    // console.log(outputSteps);
  });

  test("With OIDC Configuration test", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const environment = new AwsEnvironment(project, {
      name: "my-environment",
      account: "000000000000",
    });
    const deployJob = new DeployJob(project, {
      appName: "my-app",
      deploySteps,
      environment,
      artifactsDirectory: "foo",
    });
    const outputSteps = renderDeploySteps(deployJob);
    expect(outputSteps).toBeTruthy();
    expect(outputSteps).toMatchSnapshot();
    // console.log(outputSteps);
  });
});
