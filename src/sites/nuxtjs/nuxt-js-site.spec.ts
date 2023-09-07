import { TypeScriptProject } from "projen/lib/typescript";
import { NuxtJsSite } from "./nuxt-js-site";
import { synthFile, synthFiles } from "../../util/test-util";

test("Smoke test", () => {
  const parent = new TypeScriptProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  const vitePressSite = new NuxtJsSite({
    parent,
    name: "docs",
  });
  expect(vitePressSite).toBeTruthy();
});

describe("validate generated project files", () => {
  test("Detect new files", () => {
    const parent = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite({
      parent,
      name: "docs",
    });
    const content = synthFiles(parent, "sites");
    const fileList = Object.keys(content);
    expect(fileList).toMatchSnapshot();
    //console.log(JSON.stringify(fileList, null, 2));
  });

  test("apps/test/.gitignore", () => {
    const parent = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite({
      parent,
      name: "docs",
    });
    const content = synthFile(parent, "apps/test/.gitignore");
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test("apps/test/.npmrc", () => {
    const parent = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite({
      parent,
      name: "docs",
    });
    const content = synthFile(parent, "apps/test/.npmrc");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test("apps/test/.projen/deps.json", () => {
    const parent = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite({
      parent,
      name: "docs",
    });
    const content = synthFile(parent, "apps/test/.projen/deps.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/.projen/files.json", () => {
    const parent = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite({
      parent,
      name: "docs",
    });
    const content = synthFile(parent, "apps/test/.projen/files.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/.projen/tasks.json", () => {
    const parent = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite({
      parent,
      name: "docs",
    });
    const content = synthFile(parent, "apps/test/.projen/tasks.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/nuxt.config.ts", () => {
    const parent = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite({
      parent,
      name: "docs",
    });
    const content = synthFile(parent, "apps/test/nuxt.config.ts");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test("apps/test/package.json", () => {
    const parent = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite({
      parent,
      name: "docs",
    });
    const content = synthFile(parent, "apps/test/package.json");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test("apps/test/tsconfig.json", () => {
    const parent = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite({
      parent,
      name: "docs",
    });
    const content = synthFile(parent, "apps/test/tsconfig.json");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test("apps/test/server/tsconfig.json", () => {
    const parent = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    new NuxtJsSite({
      parent,
      name: "docs",
    });
    const content = synthFile(parent, "apps/test/server/tsconfig.json");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});
