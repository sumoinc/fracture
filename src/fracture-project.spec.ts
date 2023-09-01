import { NodeProject } from "projen/lib/javascript";
import { FractureProject } from "./fracture-project";

describe("success conditions", () => {
  test("Smoke test", () => {
    const root = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const fractureProject = new FractureProject(root, {
      name: "my-sub-project",
      outdir: "sites/foo",
    });
    expect(fractureProject).toBeTruthy();
  });
});
