import { NodeProject } from "projen/lib/javascript";
import { Environment } from "./core";
import { FractureProject } from "./fracture-project";
import { Site } from "./sites/site";
import { synthFile } from "./util/test-util";

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
    const deployment = site.deployToAws(usEast);
    expect(deployment).toBeTruthy();

    const content = synthFile(root, `.github/workflows/deployment.yml`);
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });
});
