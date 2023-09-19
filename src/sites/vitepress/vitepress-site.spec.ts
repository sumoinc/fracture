import { AwsEnvironment } from "../../environments";
import { synthFile, synthFiles, testVitePressSite } from "../../util/test-util";

describe("success conditions", () => {
  test("Smoke test", () => {
    expect(testVitePressSite()).toBeTruthy();
  });
});

describe("validate generated project files", () => {
  test("Detect new files", () => {
    const content = synthFiles(testVitePressSite());
    const fileList = Object.keys(content);
    expect(fileList).toBeTruthy();
    expect(fileList).toMatchSnapshot();
    //console.log(JSON.stringify(fileList, null, 2));
  });

  test(".eslintrc.json", () => {
    const content = synthFile(testVitePressSite(), ".eslintrc.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test(".gitattributes", () => {
    const content = synthFile(testVitePressSite(), ".gitattributes");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test(".gitignore", () => {
    const content = synthFile(testVitePressSite(), ".gitignore");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test(".npmignore", () => {
    const content = synthFile(testVitePressSite(), ".npmignore");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test(".npmrc", () => {
    const content = synthFile(testVitePressSite(), ".npmrc");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test(".prettierignore", () => {
    const content = synthFile(testVitePressSite(), ".prettierignore");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test(".prettierrc.json", () => {
    const content = synthFile(testVitePressSite(), ".prettierrc.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test(".projen/deps.json", () => {
    const content = synthFile(testVitePressSite(), ".projen/deps.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test(".projen/files.json", () => {
    const content = synthFile(testVitePressSite(), ".projen/files.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test(".projen/tasks.json", () => {
    const content = synthFile(testVitePressSite(), ".projen/tasks.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test(".vitepress/config.mts", () => {
    const content = synthFile(testVitePressSite(), ".vitepress/config.mts");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test(".vitepress/theme/index.ts", () => {
    const content = synthFile(testVitePressSite(), ".vitepress/theme/index.ts");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test(".vitepress/theme/Layout.vue", () => {
    const content = synthFile(
      testVitePressSite(),
      ".vitepress/theme/Layout.vue"
    );
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test(".vitepress/theme/style.css", () => {
    const content = synthFile(
      testVitePressSite(),
      ".vitepress/theme/style.css"
    );
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test("package.json", () => {
    const content = synthFile(testVitePressSite(), "package.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test("README.md", () => {
    const content = synthFile(testVitePressSite(), "README.md");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test("src/api-examples.md", () => {
    const content = synthFile(testVitePressSite(), "src/api-examples.md");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test("src/index.md", () => {
    const content = synthFile(testVitePressSite(), "src/index.md");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test("src/index.ts", () => {
    const content = synthFile(testVitePressSite(), "src/index.ts");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test("src/markdown-examples.md", () => {
    const content = synthFile(testVitePressSite(), "src/markdown-examples.md");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test("test/hello.test.ts", () => {
    const content = synthFile(testVitePressSite(), "test/hello.test.ts");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test("tsconfig.dev.json", () => {
    const content = synthFile(testVitePressSite(), "tsconfig.dev.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test("tsconfig.json", () => {
    const content = synthFile(testVitePressSite(), "tsconfig.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test(".projen/tasks.json", () => {
    const content = synthFile(testVitePressSite().parent, ".projen/tasks.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(JSON.stringify(content, null, 2));
  });

  test("turbo.json", () => {
    const content = synthFile(testVitePressSite().parent, "turbo.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(JSON.stringify(content, null, 2));
  });

  test(".github/workflows/deploy.yml", () => {
    const vitePressSite = testVitePressSite();
    const usEast = new AwsEnvironment(vitePressSite.parent, {
      name: "us-east",
      account: "0000000000",
    });

    // deployment options
    const deployment = vitePressSite.deploy({
      branchPrefix: "feature",
      environment: usEast,
    });
    expect(vitePressSite).toBeTruthy();
    expect(deployment).toBeTruthy();
    // console.log(vitePressSite.buildTask.name);

    const content = synthFile(
      vitePressSite.parent,
      `.github/workflows/deploy.yml`
    );
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });
});
