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

  test("services/my-service/.eslintrc.json", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/my-service/.eslintrc.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/my-service/.gitattributes", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/my-service/.gitattributes");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/my-service/.gitignore", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/my-service/.gitignore");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/my-service/.npmignore", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/my-service/.npmignore");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test.skip("services/my-service/.npmrc", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/my-service/.npmrc");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/my-service/.projen/deps.json", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/my-service/.projen/deps.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/my-service/.projen/files.json", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/my-service/.projen/files.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/my-service/.projen/tasks.json", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/my-service/.projen/tasks.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/my-service/package.json", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/my-service/package.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/my-service/README.md", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/my-service/README.md");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/my-service/src/main.ts", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/my-service/src/main.ts");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/my-service/test/main.test.ts", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/my-service/test/main.test.ts");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/my-service/tsconfig.dev.json", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/my-service/tsconfig.dev.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/my-service/tsconfig.json", () => {
    const parent = testDataService().parent;
    const content = synthFile(parent, "services/my-service/tsconfig.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
});
