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
      accountNumber: "0000000000",
    });
    expect(environment).toBeTruthy();
  });

  test("using region", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const environment = new Environment(project, {
      name: "foo",
      accountNumber: "123",
      region: "us-east-1",
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
        accountNumber: "123",
        region: "us-east-1",
      });
      new Environment(project, {
        name: "foo",
        accountNumber: "123",
        region: "us-east-1",
      });
    }).toThrow("Duplicate environment name");
  });
});
