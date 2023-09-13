import { TypeScriptProject } from "projen/lib/typescript";
import { TurboRepo } from "./turbo-repo";
import { synthFile, testFractureProject } from "../util/test-util";

describe("Success Conditions", () => {
  test("Smoke Test", () => {
    expect(new TurboRepo(testFractureProject())).toBeTruthy();
  });

  test("Empty Taskset", () => {
    const turbo = new TurboRepo(testFractureProject());
    turbo.taskSets.push({
      name: "foo",
    });
    const content = synthFile(turbo.project, "turbo.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(JSON.stringify(content, null, 2));
  });

  test("Only Build Taskset", () => {
    const turbo = new TurboRepo(testFractureProject());
    turbo.taskSets.push({
      name: "foo",
      buildTask: {
        "tool:build": {
          outputs: ["dist/**"],
        },
      },
    });
    const content = synthFile(turbo.project, "turbo.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(JSON.stringify(content, null, 2));
  });

  test("Only Test Taskset", () => {
    const turbo = new TurboRepo(testFractureProject());
    turbo.taskSets.push({
      name: "foo",
      testTask: {
        "tool:test": {},
      },
    });
    const content = synthFile(turbo.project, "turbo.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(JSON.stringify(content, null, 2));
  });

  test("Both Build and Test Taskset", () => {
    const turbo = new TurboRepo(testFractureProject());
    turbo.taskSets.push({
      name: "foo",
      buildTask: {
        "tool:build": {
          outputs: ["dist/**"],
        },
      },
      testTask: {
        "tool:test": {},
      },
    });
    const content = synthFile(turbo.project, "turbo.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(JSON.stringify(content, null, 2));
  });
});

describe("validate generated project files", () => {
  test("pnpm-workspace.yaml", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const turboRepo = TurboRepo.of(project);
    turboRepo.addWorkspaceRoot("sites");
    turboRepo.addWorkspaceRoot("services");
    const content = synthFile(project, "pnpm-workspace.yaml");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(content);
  });

  test(".projen/tasks.json", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new TurboRepo(project);
    const content = synthFile(project, ".projen/tasks.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
  });
});
