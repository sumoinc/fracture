import { Fracture } from "./fracture";
import { FractureApp } from "./fracture-app";
import { synthFile, synthFiles } from "../util/test-util";

let fracture: Fracture;
let app: FractureApp;

beforeEach(() => {
  fracture = new Fracture();
  app = new FractureApp(fracture, { name: "test" });
});

test("Smoke test", () => {
  expect(app).toBeTruthy();
});
describe("validate generated project files", () => {
  test("Detect new files", () => {
    const content = synthFiles(fracture, "apps");
    const fileList = Object.keys(content);
    expect(fileList).toMatchSnapshot();
    // console.log(JSON.stringify(fileList, null, 2));
  });

  test("apps/test/.eslintrc.json", () => {
    const content = synthFile(fracture, "apps/test/.eslintrc.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/.gitattributes", () => {
    const content = synthFile(fracture, "apps/test/.gitattributes");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/.gitignore", () => {
    const content = synthFile(fracture, "apps/test/.gitignore");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/.npmignore", () => {
    const content = synthFile(fracture, "apps/test/.npmignore");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/.npmrc", () => {
    const content = synthFile(fracture, "apps/test/.npmrc");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/.projen/deps.json", () => {
    const content = synthFile(fracture, "apps/test/.projen/deps.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/.projen/files.json", () => {
    const content = synthFile(fracture, "apps/test/.projen/files.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/.projen/tasks.json", () => {
    const content = synthFile(fracture, "apps/test/.projen/tasks.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/package.json", () => {
    const content = synthFile(fracture, "apps/test/package.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/README.md", () => {
    const content = synthFile(fracture, "apps/test/README.md");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/src/index.ts", () => {
    const content = synthFile(fracture, "apps/test/src/index.ts");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/test/hello.test.ts", () => {
    const content = synthFile(fracture, "apps/test/test/hello.test.ts");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/tsconfig.dev.json", () => {
    const content = synthFile(fracture, "apps/test/tsconfig.dev.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("apps/test/tsconfig.json", () => {
    const content = synthFile(fracture, "apps/test/tsconfig.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
});
