import { TypeScriptProject } from "projen/lib/typescript";
import { AwsEnvironment } from "./aws-environment";

describe("success conditions", () => {
  test("Smoke Test", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const environment = new AwsEnvironment(project, {
      name: "foo",
      accountNumber: "0000000000",
    });
    expect(environment).toBeTruthy();
  });

  test("using region", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const environment = new AwsEnvironment(project, {
      name: "foo",
      accountNumber: "123",
      region: "us-east-1",
    });
    expect(environment).toBeTruthy();
  });
});

describe("failure conditions", () => {
  test("Duplicate name", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    expect(() => {
      new AwsEnvironment(project, {
        name: "foo",
        accountNumber: "123",
        region: "us-east-1",
      });
      new AwsEnvironment(project, {
        name: "foo",
        accountNumber: "123",
        region: "us-east-1",
      });
    }).toThrow("Duplicate environment name");
  });
});
