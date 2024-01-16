import { TypeScriptProject } from "projen/lib/typescript";
import { Site } from "./site";

describe("success conditions", () => {
  test("Smoke test", () => {
    const parent = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const site = new Site({
      parent,
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    expect(site).toBeTruthy();
  });
});
