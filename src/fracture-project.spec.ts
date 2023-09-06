import { NodeProject } from "projen/lib/javascript";
import { FractureProject } from "./fracture-project";
import { synthFile } from "./util/test-util";

describe("success conditions", () => {
  test("Smoke test", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const fractureProject = new FractureProject(project, {
      name: "my-sub-project",
      outdir: "sites/foo",
    });
    expect(fractureProject).toBeTruthy();
  });
});

test("apps/test/.projen/deps.json", () => {
  const project = new NodeProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  new FractureProject(project, {
    name: "my-sub-project",
    outdir: "sites/foo",
  });

  const content = synthFile(project, "sites/foo/.projen/tasks.json") as any;
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  // these tasks should be reset with undefined steps in all Fracture sub-projects
  expect(content.tasks.default.steps).toBeUndefined();
  expect(content.tasks.package.steps).toBeUndefined();
  //console.log(JSON.stringify(content.tasks.default, null, 2));
});
