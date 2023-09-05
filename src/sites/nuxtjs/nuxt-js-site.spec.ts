import { NodeProject } from "projen/lib/javascript";
import { NuxtJsSite } from "./nuxt-js-site";
import { synthFile, synthFiles } from "../../util/test-util";

test("Smoke test", () => {
  const project = new NodeProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  const vitePressSite = new NuxtJsSite(project, {
    name: "docs",
  });
  expect(vitePressSite).toBeTruthy();
});

describe("validate generated project files", () => {
  test("Detect new files", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite(project, {
      name: "docs",
    });
    const content = synthFiles(project, "sites");
    const fileList = Object.keys(content);
    expect(fileList).toMatchSnapshot();
    //console.log(JSON.stringify(fileList, null, 2));
  });

  test("apps/test/.gitignore", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite(project, {
      name: "docs",
    });
    const content = synthFile(project, "apps/test/.gitignore");
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test("apps/test/.npmrc", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite(project, {
      name: "docs",
    });
    const content = synthFile(project, "apps/test/.npmrc");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test("apps/test/.projen/deps.json", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite(project, {
      name: "docs",
    });
    const content = synthFile(project, "apps/test/.projen/deps.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/.projen/files.json", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite(project, {
      name: "docs",
    });
    const content = synthFile(project, "apps/test/.projen/files.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/.projen/tasks.json", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite(project, {
      name: "docs",
    });
    const content = synthFile(project, "apps/test/.projen/tasks.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/nuxt.config.ts", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite(project, {
      name: "docs",
    });
    const content = synthFile(project, "apps/test/nuxt.config.ts");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test("apps/test/package.json", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite(project, {
      name: "docs",
    });
    const content = synthFile(project, "apps/test/package.json");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test("apps/test/tsconfig.json", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite(project, {
      name: "docs",
    });
    const content = synthFile(project, "apps/test/tsconfig.json");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test("apps/test/server/tsconfig.json", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite(project, {
      name: "docs",
    });
    const content = synthFile(project, "apps/test/server/tsconfig.json");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});
