import { DeployTarget } from "./deploy-target";
import { Pipeline } from "./pipeline";
import { Environment, FractureService } from "../core";
import { Fracture } from "../core/fracture";
import { synthFile } from "../util/test-util";

describe("success conditions", () => {
  test("Smoke test", () => {
    const fracture = new Fracture();
    const deployTarget = new DeployTarget(fracture, {
      branchName: "main",
      environment: new Environment(fracture, {
        name: "my-env",
        accountNumber: "123",
        region: "us-east-1",
      }),
      service: new FractureService(fracture, {
        name: "my-service",
      }),
    });
    expect(deployTarget).toBeTruthy();

    const pipeline = Pipeline.byBranchName(fracture, "main");
    const content = synthFile(
      fracture,
      `.github/workflows/${pipeline!.name}.yml`
    );
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});

describe("failure conditions", () => {});
