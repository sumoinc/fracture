import { Pipeline } from "./pipeline";
import { Account } from "../core/account";
import { Environment } from "../core/environment";
import { Fracture } from "../core/fracture";
import { synthFile } from "../util/test-util";

let fracture: Fracture;

beforeEach(() => {
  fracture = new Fracture();
});

test("Smoke test", () => {
  const pipeline = new Pipeline(fracture, {
    name: "foo",
    branchTriggerPatterns: ["main"],
  });
  expect(pipeline).toBeTruthy();

  const content = synthFile(fracture, ".github/workflows/foo.yml");
  expect(content).toMatchSnapshot();
  //console.log(content);
});

test("able to add deployment environments", () => {
  const usEast = new Environment(fracture, {
    name: "us-east",
    account: new Account(fracture, {
      name: "my-account",
      accountNumber: "123",
    }),
    region: "us-east-1",
  });
  const myService = fracture.addService({ name: "my-service" });
  const myOtherService = fracture.addService({ name: "my-other-service" });

  // deploy both services to ue-east-1
  fracture.featurePipeline.addServiceDeployments(
    [myService, myOtherService],
    [usEast]
  );

  const content = synthFile(
    fracture,
    `.github/workflows/${fracture.featurePipeline.name}.yml`
  );
  expect(content).toMatchSnapshot();
  // console.log(content);
});
