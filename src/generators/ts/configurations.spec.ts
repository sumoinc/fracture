import { GenerateConfigurations } from "./configurations";
import { synthFile, testDataService } from "../../util/test-util";

test("Smoke test", () => {
  const service = testDataService();
  new GenerateConfigurations(service);

  const content = synthFile(service, "src/configurations.ts");
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  // console.log(content);
});
