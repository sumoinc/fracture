import { TypeScriptProject } from "projen/lib/typescript";
import { FractureProject } from "./fracture-project";
import { synthFile } from "./util/test-util";

describe("Success conditions", () => {
  test("No parent", () => {
    const fractureProject = new FractureProject({
      name: "my-sub-project",
    });
    expect(fractureProject).toBeTruthy();
  });

  test("With Parent", () => {
    const parent = new FractureProject({
      name: "my-project",
    });
    const subProject = new FractureProject({
      parent,
      name: "my-sub-project",
      outdir: "sites/foo",
    });
    expect(subProject).toBeTruthy();
  });
});

test("apps/test/.projen/deps.json", () => {
  const parent = new TypeScriptProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  new FractureProject({
    parent,
    name: "my-sub-project",
    outdir: "sites/foo",
  });

  const content = synthFile(parent, "sites/foo/.projen/tasks.json") as any;
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  // these tasks should be reset with undefined steps in all Fracture sub-projects
  expect(content.tasks.default.steps).toBeUndefined();
  expect(content.tasks.package.steps).toBeUndefined();
  //console.log(JSON.stringify(content.tasks.default, null, 2));
});
