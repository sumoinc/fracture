import { TypeScriptProject } from "projen/lib/typescript";
import { TurboRepo } from "./turbo-repo";
import { synthFile } from "../util/test-util";

test("Smoke test", () => {
  const project = new TypeScriptProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  const turboRepo = new TurboRepo(project);
  expect(turboRepo).toBeTruthy();
});

describe("validate generated project files", () => {
  test.only("pnpm-workspace.yaml", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const turboRepo = TurboRepo.of(project);
    turboRepo.addWorkspaceRoot("sites");
    turboRepo.addWorkspaceRoot("services");
    const content = synthFile(project, "pnpm-workspace.yaml");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });

  test.only(".projen/tasks.json", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new TurboRepo(project);
    const content = synthFile(project, ".projen/tasks.json");
    expect(content).toMatchSnapshot();
    //console.log(JSON.stringify(content, null, 2));
    // @ts-ignore
    // console.log(JSON.stringify(content.tasks.build, null, 2));
    // @ts-ignore
    // console.log(JSON.stringify(content.tasks.default, null, 2));
    // @ts-ignore
    // console.log(JSON.stringify(content.tasks["pre-compile"], null, 2));
    // @ts-ignore
    // console.log(JSON.stringify(content.tasks.compile, null, 2));
    // @ts-ignore
    // console.log(JSON.stringify(content.tasks["post-compile"], null, 2));
    // @ts-ignore
    // console.log(JSON.stringify(content.tasks.test, null, 2));
    // @ts-ignore
    // console.log(JSON.stringify(content.tasks.package, null, 2));
    // @ts-ignore
    // console.log(JSON.stringify(content.tasks.eslint, null, 2));
  });
});
