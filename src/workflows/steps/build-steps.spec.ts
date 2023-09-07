import { NodePackageManager } from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";
import { renderBuildSteps } from "./build-steps";
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
    const buildSteps = renderBuildSteps(workflow);
    expect(buildSteps).toBeTruthy();
    expect(buildSteps).toMatchSnapshot();
    // console.log(buildSteps);
  });

  test("With Yarn", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
      packageManager: NodePackageManager.YARN,
    });
    const workflow = new Workflow(project, {
      name: "my-workflow",
    });
    const buildSteps = renderBuildSteps(workflow);
    expect(buildSteps).toBeTruthy();
    expect(buildSteps).toMatchSnapshot();
    // console.log(buildSteps);
  });

  test("With Yarn 2", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
      packageManager: NodePackageManager.YARN2,
    });
    const workflow = new Workflow(project, {
      name: "my-workflow",
    });
    const buildSteps = renderBuildSteps(workflow);
    expect(buildSteps).toBeTruthy();
    expect(buildSteps).toMatchSnapshot();
    // console.log(buildSteps);
  });

  test("With PNPM", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
      packageManager: NodePackageManager.PNPM,
    });
    const workflow = new Workflow(project, {
      name: "my-workflow",
    });
    const buildSteps = renderBuildSteps(workflow);
    expect(buildSteps).toBeTruthy();
    expect(buildSteps).toMatchSnapshot();
    // console.log(buildSteps);
  });

  test("With NPM", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
      packageManager: NodePackageManager.NPM,
    });
    const workflow = new Workflow(project, {
      name: "my-workflow",
    });
    const buildSteps = renderBuildSteps(workflow);
    expect(buildSteps).toBeTruthy();
    expect(buildSteps).toMatchSnapshot();
    // console.log(buildSteps);
  });
});