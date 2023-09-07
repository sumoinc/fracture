import { TypeScriptProject } from "projen/lib/typescript";
import { Site } from "./site";

describe("success conditions", () => {
  test("Smoke test", () => {
    const root = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const site = new Site(root, {
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    expect(site).toBeTruthy();
  });
});
