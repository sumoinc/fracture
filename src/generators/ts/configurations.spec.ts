import { Fracture, FractureService } from "../../core";
import { ServiceDeployTarget } from "../../pipelines";
import { synthFile } from "../../util/test-util";

test("Smoke test", () => {
  const fracture = new Fracture();
  new ServiceDeployTarget(fracture, {
    branchName: "main",
    environmentName: "us-east",
    service: new FractureService(fracture, { name: "my-service" }),
  });

  const content = synthFile(
    fracture,
    "services/my-service/src/generated/configurations.ts"
  );
  expect(content).toMatchSnapshot();
  //console.log(content);
});
