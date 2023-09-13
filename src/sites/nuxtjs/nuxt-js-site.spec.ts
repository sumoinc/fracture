import { AwsEnvironment } from "../../environments";
import { synthFile, synthFiles, testNuxtJsSite } from "../../util/test-util";

describe("success conditions", () => {
  test("Smoke test", () => {
    const nuxtSite = testNuxtJsSite();
    expect(nuxtSite).toBeTruthy();
  });
});

describe("validate generated project files", () => {
  test("Detect new files", () => {
    const nuxtSite = testNuxtJsSite();
    const content = synthFiles(nuxtSite);
    const fileList = Object.keys(content);
    expect(fileList).toMatchSnapshot();
    //console.log(JSON.stringify(fileList, null, 2));
  });

  test(".gitignore", () => {
    const nuxtSite = testNuxtJsSite();
    const content = synthFile(nuxtSite, ".gitignore");
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test(".npmrc", () => {
    const nuxtSite = testNuxtJsSite();
    const content = synthFile(nuxtSite, ".npmrc");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test(".projen/deps.json", () => {
    const nuxtSite = testNuxtJsSite();
    const content = synthFile(nuxtSite, ".projen/deps.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test(".projen/files.json", () => {
    const nuxtSite = testNuxtJsSite();
    const content = synthFile(nuxtSite, ".projen/files.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test(".projen/tasks.json", () => {
    const nuxtSite = testNuxtJsSite();
    const content = synthFile(nuxtSite, ".projen/tasks.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("nuxt.config.ts", () => {
    const nuxtSite = testNuxtJsSite();
    const content = synthFile(nuxtSite, "nuxt.config.ts");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test("package.json", () => {
    const nuxtSite = testNuxtJsSite();
    const content = synthFile(nuxtSite, "package.json");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test("tsconfig.json", () => {
    const nuxtSite = testNuxtJsSite();
    const content = synthFile(nuxtSite, "tsconfig.json");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test("server/tsconfig.json", () => {
    const nuxtSite = testNuxtJsSite();
    const content = synthFile(nuxtSite, "server/tsconfig.json");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });

  test(".github/workflows/deploy.yml", () => {
    const nuxtSite = testNuxtJsSite();
    const usEast = new AwsEnvironment(nuxtSite.parent, {
      name: "us-east",
      accountNumber: "0000000000",
    });

    // site options
    const deployment = nuxtSite.deploy({
      branchPrefix: "feature",
      environment: usEast,
    });
    expect(nuxtSite).toBeTruthy();
    expect(deployment).toBeTruthy();
    // console.log(vitePressSite.buildTask.name);

    const content = synthFile(nuxtSite.parent, `.github/workflows/deploy.yml`);
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    console.log(content);
  });
});
