import { TypeScriptProject } from "projen/lib/typescript";
import { Site } from "./site";

describe("success conditions", () => {
  test("Smoke test", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const site = new Site(project, {
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    expect(site).toBeTruthy();
  });
});
