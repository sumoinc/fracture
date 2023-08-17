import { Fracture } from "./fracture";
import { synthFile, synthFiles } from "../util/test-util";

let fracture: Fracture;

beforeEach(() => {
  fracture = new Fracture();
});

test("Smoke test", () => {
  expect(fracture).toBeTruthy();
});

describe("validate generated project files", () => {
  test("Detect new files", () => {
    // make it just a little bit complicated
    const service = fracture.addService({ name: "test-service" });
    const resource = service.addResource({ name: "test-resource" });
    resource.addAttribute({ name: "test-attribute" });

    // snapshot all files.
    const content = synthFiles(fracture, "");
    const fileList = Object.keys(content);
    expect(fileList).toMatchSnapshot();
    //console.log(JSON.stringify(fileList, null, 2));
  });

  test(".eslintrc.json", () => {
    const content = synthFile(fracture, ".eslintrc.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test(".gitattributes", () => {
    const content = synthFile(fracture, ".gitattributes");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test(".github/pull_request_template.md", () => {
    const content = synthFile(fracture, ".github/pull_request_template.md");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test(".github/workflows/build.yml", () => {
    const content = synthFile(fracture, ".github/workflows/build.yml");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test(".github/workflows/pull-request-lint.yml", () => {
    const content = synthFile(
      fracture,
      ".github/workflows/pull-request-lint.yml"
    );
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test(".github/workflows/release.yml", () => {
    const content = synthFile(fracture, ".github/workflows/release.yml");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test(".github/workflows/upgrade-main.yml", () => {
    const content = synthFile(fracture, ".github/workflows/upgrade-main.yml");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test(".gitignore", () => {
    const content = synthFile(fracture, ".gitignore");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test(".mergify.yml", () => {
    const content = synthFile(fracture, ".mergify.yml");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test(".npmignore", () => {
    const content = synthFile(fracture, ".npmignore");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test(".npmrc", () => {
    const content = synthFile(fracture, ".npmrc");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test(".prettierignore", () => {
    const content = synthFile(fracture, ".prettierignore");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test(".prettierrc.json", () => {
    const content = synthFile(fracture, ".prettierrc.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test(".projen/deps.json", () => {
    const content = synthFile(fracture, ".projen/deps.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test(".projen/files.json", () => {
    const content = synthFile(fracture, ".projen/files.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test(".projen/tasks.json", () => {
    const content = synthFile(fracture, ".projen/tasks.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("package.json", () => {
    const content = synthFile(fracture, "package.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("README.md", () => {
    const content = synthFile(fracture, "README.md");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("src/index.ts", () => {
    const content = synthFile(fracture, "src/index.ts");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("test/hello.test.ts", () => {
    const content = synthFile(fracture, "test/hello.test.ts");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("tsconfig.dev.json", () => {
    const content = synthFile(fracture, "tsconfig.dev.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("tsconfig.json", () => {
    const content = synthFile(fracture, "tsconfig.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("turbo.json", () => {
    const content = synthFile(fracture, "turbo.json");
    expect(content).toMatchSnapshot();
    //console.log(JSON.stringify(content, null, 2));
  });
});

describe("Helper functions", () => {
  test("Add app", () => {
    const app = fracture.addApp({ name: "test-app" });
    expect(app).toBeTruthy();
  });
  test("Add service", () => {
    const service = fracture.addService({ name: "test-service" });
    expect(service).toBeTruthy();
  });
});
