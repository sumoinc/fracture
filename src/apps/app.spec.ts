import { TypeScriptProject } from "projen/lib/typescript";
import { App } from "./app";

describe("success conditions", () => {
  test("Smoke test", () => {
    const parent = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const app = new App({
      parent,
      name: "my-app",
      defaultReleaseBranch: "main",
    });
    expect(app).toBeTruthy();
  });
});
