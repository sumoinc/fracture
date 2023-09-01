import { NodeProject } from "projen/lib/javascript";
import { Environment } from "./environments";
import { FractureProject } from "./fracture-project";
import { Site } from "./sites/site";
import { synthFile } from "./util/test-util";
import { AuthProvider } from "./workflows/auth-provider";

describe("success conditions", () => {
  test("Smoke test", () => {
    const root = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const fractureProject = new FractureProject(root, {
      name: "my-sub-project",
      outdir: "sites/foo",
    });
    expect(fractureProject).toBeTruthy();
  });

  test("With Deployment", () => {
    const root = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const site = new Site(root, {
      name: "my-site",
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
    const content = synthFile(root, `.github/workflows/deployment.yml`);
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });
});
