import { Pipeline } from "./pipeline";
import { ServiceDeployTarget } from "./service-deploy-target";
import { Environment, FractureService } from "../core";
import { Fracture } from "../core/fracture";
import { synthFile } from "../util/test-util";

describe("success conditions", () => {
  test("Smoke test", () => {
    const fracture = new Fracture();
    const pipeline = new Pipeline(fracture, {
      branchName: "foo",
    });
    expect(pipeline).toBeTruthy();

    const content = synthFile(
      fracture,
      `.github/workflows/${pipeline.name}.yml`
    );
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test("With two services", () => {
    const fracture = new Fracture();
    const environment = new Environment(fracture, {
      name: "us-east",
      accountNumber: "123456789",
    });
    new ServiceDeployTarget(fracture, {
      branchName: "main",
      environment,
      service: new FractureService(fracture, {
        name: "service-one",
      }),
    });
    new ServiceDeployTarget(fracture, {
      branchName: "main",
      environment,
      service: new FractureService(fracture, {
        name: "service-two",
      }),
    });
    const pipeline = Pipeline.byBranchName(fracture, "main");
    expect(pipeline).toBeTruthy();

    const content = synthFile(
      fracture,
      `.github/workflows/${pipeline!.name}.yml`
    );
    expect(content).toMatchSnapshot();
    // console.log(content);
  });
});

describe("failure conditions", () => {
  test("duplicate branch", () => {
    const fracture = new Fracture();
    expect(() => {
      new Pipeline(fracture, {
        branchName: "main",
      });
    }).toThrow("Duplicate pipeline for branch name");
  });
});
