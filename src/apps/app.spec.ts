import { TypeScriptProject } from "projen/lib/typescript";
import { App } from "./app";

describe("success conditions", () => {
  test("Smoke test", () => {
    const root = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const app = new App(root, {
      name: "my-app",
      defaultReleaseBranch: "main",
    });
    expect(app).toBeTruthy();
  });
});
