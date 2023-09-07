import { TypeScriptProject } from "projen/lib/typescript";
import { NetlifyEnvironment } from "./netlify-environment";
import { VitePressSite } from "../sites/vitepress/vitepress-site";
import { synthFile } from "../util/test-util";

describe("success conditions", () => {
  test("Smoke Test", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const environment = new NetlifyEnvironment(project, {
      name: "foo",
    });
    expect(environment).toBeTruthy();
  });

  test("with siteid", () => {
    const parent = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const environment = new NetlifyEnvironment(parent, {
      name: "foo",
      siteId: "bar",
    });
    expect(environment).toBeTruthy();

    // site options
    const vitePressSite = new VitePressSite({
      parent,
      name: "docs",
      defaultReleaseBranch: "main",
    });

    vitePressSite.deploy({
      branchPrefix: "feature",
      environment,
    });

    const content = synthFile(parent, `.github/workflows/deploy.yml`);
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });
});
