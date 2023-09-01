import { TypeScriptProject } from "projen/lib/typescript";
import { Site } from "./site";
import { Environment } from "../environments";
import { AuthProvider } from "../workflows/auth-provider";

describe("success conditions", () => {
  test("Smoke test", () => {
    const root = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const site = new Site(root, {
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    expect(site).toBeTruthy();
  });
  test("With Deployment", () => {
    const root = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const site = new Site(root, {
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const usEast = new Environment(root, {
      name: "us-east",
      accountNumber: "0000000000",
    });
    const deployTask = site.addTask(`cdk:deploy:foo`, {
      description: `Deploy the foo`,
      exec: `echo 'deploying foo'`,
    });
    const deployment = site.deployToAws({
      branchPrefix: "feature",
      deployTask,
      authProvider: AuthProvider.fromEnvironment(root, usEast),
    });
    expect(deployment).toBeTruthy();
  });
});
