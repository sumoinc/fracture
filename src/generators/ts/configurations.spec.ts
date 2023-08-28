import { GeneratedConfigurations } from "./configurations";
import { Fracture, FractureService } from "../../core";
import { ServiceDeployTarget } from "../../pipelines";
import { synthFile } from "../../util/test-util";

test("Smoke test", () => {
  const fracture = new Fracture();
  const service = new FractureService(fracture, { name: "my-service" });
  new ServiceDeployTarget(fracture, {
    branchName: "main",
    environmentName: "us-east",
    service,
  });
  new GeneratedConfigurations(service);

  const content = synthFile(
    fracture,
    "services/my-service/src/generated/configurations.ts"
  );
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  //console.log(content);
});
