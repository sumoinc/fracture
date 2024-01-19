import * as spec from "@jsii/spec";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { JsiiFaker } from "./jsii-faker";
import { synthFiles } from "../util";

describe("Success conditions", () => {
  test("Smoke Test", () => {
    const { faker } = buildDefaultFaker();
    expect(faker).toBeTruthy();
  });
});

describe("Files", () => {
  test("Smoke test", () => {
    const { project } = buildDefaultFaker();

    const content = synthFiles(project);
    expect(content[".jsii"]).toBeTruthy();
    expect(content[".jsii"]).toMatchSnapshot();

    //console.log(content[".jsii"]);
  });

  test("Assembly name should match package name", () => {
    const { project } = buildDefaultFaker();

    const files = synthFiles(project);
    const content = JSON.parse(files[".jsii"]) as spec.Assembly;
    expect(content.name).toBe("@my-scope/myproject");

    //console.log(content);
  });
});

/**
 * Simple test project type as test harness
 */
interface TestProjectOptions extends TypeScriptProjectOptions {}
class TestProject extends TypeScriptProject {
  constructor(options: TestProjectOptions) {
    super(options);
  }
}

/**
 * Build faker using only required fields and allowing defaults to kick in.
 *
 */
const buildDefaultFaker = () => {
  const project = new TestProject({
    name: "my-project",
    packageName: "@my-scope/myproject",
    defaultReleaseBranch: "main",
  });

  const faker = new JsiiFaker(project);
  faker.addClassType({
    name: "FooProject",
  });
  return { project, faker };
};
