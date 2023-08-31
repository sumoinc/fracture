import { GenerateConfigurations } from "./configurations";
import { Fracture, FractureService } from "../../core";
import { synthFile } from "../../util/test-util";

test("Smoke test", () => {
  const fracture = new Fracture();
  const service = new FractureService(fracture, { name: "my-service" });
  /*
  new ServiceDeployTarget(fracture, {
    branchName: "main",
    environmentName: "us-east",
    service,
  });
  */
  new GenerateConfigurations(service);

  const content = synthFile(
    fracture,
    "services/my-service/src/generated/configurations.ts"
  );
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  //console.log(content);
});
