import { TypeScriptProject } from "projen/lib/typescript";
import { VitePressSite } from "./vitepress-site";

describe("success conditions", () => {
  test("Smoke test", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const vitePressSite = new VitePressSite(project);
    expect(vitePressSite).toBeTruthy();
  });

  test("With deploy", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const vitePressSite = new VitePressSite(project);
    expect(vitePressSite).toBeTruthy();

    console.log(vitePressSite.buildTask.name);
  });
});
