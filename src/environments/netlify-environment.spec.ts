import { NodeProject } from "projen/lib/javascript";
import { NetlifyEnvironment } from "./netlify-environment";
import { VitePressSite } from "../sites/vitepress/vitepress-site";
import { synthFile } from "../util/test-util";

describe("success conditions", () => {
  test("Smoke Test", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const environment = new NetlifyEnvironment(project, {
      name: "foo",
    });
    expect(environment).toBeTruthy();
  });

  test("with siteid", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const environment = new NetlifyEnvironment(project, {
      name: "foo",
      siteId: "bar",
    });
    expect(environment).toBeTruthy();

    // site options
    const vitePressSite = new VitePressSite(project, {
      name: "docs",
      defaultReleaseBranch: "main",
    });
    vitePressSite.deploy({
      branchPrefix: "feature",
      environment,
    });

    const content = synthFile(project, `.github/workflows/deployment.yml`);
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });
});
