import { Fracture } from "./fracture";
import { FractureService } from "./fracture-service";
import { synthFile, synthFiles } from "../util/test-util";

let fracture: Fracture;
let service: FractureService;

beforeEach(() => {
  fracture = new Fracture();
  service = new FractureService(fracture, { name: "foo" });
});

test("Smoke test", () => {
  expect(service).toBeTruthy();
});
describe("validate generated project files", () => {
  test("Detect new files", () => {
    const content = synthFiles(fracture, "services");
    const fileList = Object.keys(content);
    expect(fileList).toMatchSnapshot();
    //console.log(JSON.stringify(fileList, null, 2));
  });

  test("services/foo/.eslintrc.json", () => {
    const content = synthFile(fracture, "services/foo/.eslintrc.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/.gitattributes", () => {
    const content = synthFile(fracture, "services/foo/.gitattributes");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/.gitignore", () => {
    const content = synthFile(fracture, "services/foo/.gitignore");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/.npmignore", () => {
    const content = synthFile(fracture, "services/foo/.npmignore");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/.npmrc", () => {
    const content = synthFile(fracture, "services/foo/.npmrc");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/.projen/deps.json", () => {
    const content = synthFile(fracture, "services/foo/.projen/deps.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/.projen/files.json", () => {
    const content = synthFile(fracture, "services/foo/.projen/files.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/.projen/tasks.json", () => {
    const content = synthFile(fracture, "services/foo/.projen/tasks.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/package.json", () => {
    const content = synthFile(fracture, "services/foo/package.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/README.md", () => {
    const content = synthFile(fracture, "services/foo/README.md");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/src/index.ts", () => {
    const content = synthFile(fracture, "services/foo/src/index.ts");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/test/hello.test.ts", () => {
    const content = synthFile(fracture, "services/foo/test/hello.test.ts");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/tsconfig.dev.json", () => {
    const content = synthFile(fracture, "services/foo/tsconfig.dev.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
  test("services/foo/tsconfig.json", () => {
    const content = synthFile(fracture, "services/foo/tsconfig.json");
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
});
