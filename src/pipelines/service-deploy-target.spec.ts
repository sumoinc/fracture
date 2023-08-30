import { Pipeline } from "./pipeline";
import { ServiceDeployTarget } from "./jobs/deploy-job";
import { Environment, FractureService } from "../core";
import { Fracture } from "../core/fracture";
import { synthFile } from "../util/test-util";

describe("success conditions", () => {
  test("Smoke test", () => {
    const fracture = new Fracture();
    const deployTarget = new ServiceDeployTarget(fracture, {
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

  test("dependant deployments", () => {
    const fracture = new Fracture();
    const service = new FractureService(fracture, {
      name: "my-service",
    });
    const usEast = new Environment(fracture, {
      name: "us-east",
      accountNumber: "123",
      region: "us-east-1",
    });
    const usWest = new Environment(fracture, {
      name: "us-west",
      accountNumber: "123",
      region: "us-west-2",
    });
    const deployTargetEast = new ServiceDeployTarget(fracture, {
      branchName: "main",
      environment: usEast,
      service,
    });
    const deployTargetWest = new ServiceDeployTarget(fracture, {
      branchName: "main",
      environment: usWest,
      service,
    }).dependsOn(deployTargetEast);
    expect(deployTargetEast).toBeTruthy();
    expect(deployTargetWest).toBeTruthy();

    const pipeline = Pipeline.byBranchName(fracture, "main");
    const content = synthFile(
      fracture,
      `.github/workflows/${pipeline!.name}.yml`
    );
    expect(content).toMatchSnapshot();
    // console.log(content);
  });
});

describe("failure conditions", () => {
  test("prevent duplicate configs", () => {
    const fracture = new Fracture();
    new Environment(fracture, {
      name: "my-env",
    });
    new FractureService(fracture, {
      name: "my-service",
    });
    new ServiceDeployTarget(fracture, {
      branchName: "main",
      environmentName: "my-env",
      serviceName: "my-service",
    });
    expect(() => {
      new ServiceDeployTarget(fracture, {
        branchName: "main",
        environmentName: "my-env",
        serviceName: "my-service",
      });
    }).toThrow("Duplicate deploy target");
  });
});
