import { Fracture } from "../core";
import { synthFile } from "../util/test-util";

let fracture: Fracture;

beforeEach(() => {
  fracture = new Fracture();
});

test("Smoke test", () => {
  expect(fracture).toBeTruthy();
});

describe("validate generated project files", () => {
  test.only(".projen/tasks.json", () => {
    const content = synthFile(fracture, ".projen/tasks.json");
    expect(content).toMatchSnapshot();
    //console.log(JSON.stringify(content, null, 2));
    // @ts-ignore
    console.log(JSON.stringify(content.tasks.build, null, 2));
    // @ts-ignore
    console.log(JSON.stringify(content.tasks.default, null, 2));
    // @ts-ignore
    console.log(JSON.stringify(content.tasks["pre-compile"], null, 2));
    // @ts-ignore
    console.log(JSON.stringify(content.tasks.compile, null, 2));
    // @ts-ignore
    console.log(JSON.stringify(content.tasks["post-compile"], null, 2));
    // @ts-ignore
    console.log(JSON.stringify(content.tasks.test, null, 2));
    // @ts-ignore
    console.log(JSON.stringify(content.tasks.package, null, 2));
    // @ts-ignore
    console.log(JSON.stringify(content.tasks.eslint, null, 2));
  });
});
