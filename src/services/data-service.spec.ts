import { synthFile, synthFiles, testDataService } from "../util/test-util";

describe("success conditions", () => {
  test("Smoke test", () => {
    const service = testDataService();
    expect(service).toBeTruthy();
  });
});

describe("validate generated project files", () => {
  test("Detect new files", () => {
    const parent = testDataService().parent;
    const content = synthFiles(parent, "services");
    const fileList = Object.keys(content);
    expect(content).toBeTruthy();
    expect(fileList).toMatchSnapshot();
    // console.log(JSON.stringify(fileList, null, 2));
  });

  test("services/foo/.eslintrc.json", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/foo/.eslintrc.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/.gitattributes", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/foo/.gitattributes");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/.gitignore", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/foo/.gitignore");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/.npmignore", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/foo/.npmignore");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test.skip("services/foo/.npmrc", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/foo/.npmrc");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/.projen/deps.json", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/foo/.projen/deps.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/.projen/files.json", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/foo/.projen/files.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/.projen/tasks.json", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/foo/.projen/tasks.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/package.json", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/foo/package.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/README.md", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/foo/README.md");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/src/main.ts", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/foo/src/main.ts");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/test/main.test.ts", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/foo/test/main.test.ts");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/tsconfig.dev.json", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/foo/tsconfig.dev.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/tsconfig.json", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/foo/tsconfig.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
});
