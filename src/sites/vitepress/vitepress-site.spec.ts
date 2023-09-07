import { TypeScriptProject } from "projen/lib/typescript";
import { VitePressSite } from "./vitepress-site";
import { AwsEnvironment } from "../../environments";
import { FractureProject } from "../../fracture-project";
import { synthFile } from "../../util/test-util";

describe("success conditions", () => {
  test("Smoke test", () => {
    const vitePressSite = new VitePressSite({
      parent: new FractureProject({
        name: "my-project",
      }),
      name: "docs",
      defaultReleaseBranch: "main",
    });
    expect(vitePressSite).toBeTruthy();
  });

  test("With deploy", () => {
    // root project options
    const parent = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const usEast = new AwsEnvironment(parent, {
      name: "us-east",
      accountNumber: "0000000000",
    });

    // site options
    const vitePressSite = new VitePressSite({
      parent,
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

    const content = synthFile(parent, `.github/workflows/deploy.yml`);
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });
});
