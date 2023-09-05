import { NuxtJsApp } from "./nuxt-js-app";
import { Fracture } from "../../core";
import { synthFile, synthFiles } from "../../util/test-util";

let fracture: Fracture;
let app: NuxtJsApp;

beforeEach(() => {
  fracture = new Fracture();
  app = new NuxtJsApp(fracture, { name: "test" });
});

test("Smoke test", () => {
  expect(app).toBeTruthy();
});
describe("validate generated project files", () => {
  test("Detect new files", () => {
    const content = synthFiles(fracture, "apps");
    const fileList = Object.keys(content);
    expect(fileList).toMatchSnapshot();
    //console.log(JSON.stringify(fileList, null, 2));
  });

  test("apps/test/.gitignore", () => {
    const content = synthFile(fracture, "apps/test/.gitignore");
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test("apps/test/.npmrc", () => {
    const content = synthFile(fracture, "apps/test/.npmrc");
    expect(content).toMatchSnapshot();
    //console.log(content);
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
  test("apps/test/nuxt.config.ts", () => {
    const content = synthFile(fracture, "apps/test/nuxt.config.ts");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test("apps/test/package.json", () => {
    const content = synthFile(fracture, "apps/test/package.json");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test("apps/test/tsconfig.json", () => {
    const content = synthFile(fracture, "apps/test/tsconfig.json");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test("apps/test/server/tsconfig.json", () => {
    const content = synthFile(fracture, "apps/test/server/tsconfig.json");
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});
