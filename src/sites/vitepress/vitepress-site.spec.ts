import { TypeScriptProject } from "projen/lib/typescript";
import { VitePressSite } from "./vitepress-site";
import { AwsEnvironment } from "../../environments";
import { synthFile } from "../../util/test-util";

describe("success conditions", () => {
  test("Smoke test", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const vitePressSite = new VitePressSite(project, {
      name: "docs",
      defaultReleaseBranch: "main",
    });
    expect(vitePressSite).toBeTruthy();
  });

  test("With deploy", () => {
    // root project options
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const usEast = new AwsEnvironment(project, {
      name: "us-east",
      accountNumber: "0000000000",
    });

    // site options
    const vitePressSite = new VitePressSite(project, {
      name: "docs",
      defaultReleaseBranch: "main",
    });
    const deployment = vitePressSite.deploy({
      branchPrefix: "feature",
      environment: usEast,
    });
    expect(vitePressSite).toBeTruthy();
    expect(deployment).toBeTruthy();
    // console.log(vitePressSite.buildTask.name);

    const content = synthFile(project, `.github/workflows/deployment.yml`);
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });
});
