import { TypeScriptProject } from "projen/lib/typescript";
import { App } from "./app";

describe("success conditions", () => {
  test("Smoke test", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const app = new App(project, {
      name: "my-app",
      defaultReleaseBranch: "main",
    });
    expect(app).toBeTruthy();
  });
});
