import { NodeProject } from "projen/lib/javascript";
import { Environment } from "./environment";

describe("success conditions", () => {
  test("Smoke Test", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const environment = new Environment(project, {
      name: "foo",
    });
    expect(environment).toBeTruthy();
  });
});

describe("failure conditions", () => {
  test("Duplicate name", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    expect(() => {
      new Environment(project, {
        name: "foo",
      });
      new Environment(project, {
        name: "foo",
      });
    }).toThrow("Duplicate environment name");
  });
});
