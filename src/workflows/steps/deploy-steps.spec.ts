import { JobStep } from "projen/lib/github/workflows-model";
import { TypeScriptProject } from "projen/lib/typescript";
import { renderDeploySteps } from "./deploy-steps";
import { Environment } from "../../environments";
import { DeployJob } from "../jobs/deploy-job";

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
    const environment = new Environment(project, {
      name: "my-environment",
    });
    const deployJob = new DeployJob(project, {
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
    const deploySteps: Array<JobStep> = [
      {
        name: "Say foo",
        run: "echo 'foo'",
      },
    ];
    const environment = new Environment(project, {
      name: "my-environment",
    });
    const deployJob = new DeployJob(project, {
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
