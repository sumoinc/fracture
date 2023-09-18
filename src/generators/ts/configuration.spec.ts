import { Configuration } from "./configuration";
import { Resource } from "../../services";
import { synthFile, testDataService } from "../../util/test-util";

test("Smoke test", () => {
  const service = testDataService();
  new Resource(service, {
    name: "user",
    attributeOptions: [
      {
        name: "name",
      },
    ],
  });

  new Resource(service, {
    name: "widget",
    tenantEnabled: true,
    attributeOptions: [
      {
        name: "name",
      },
    ],
  });
  new Configuration(service);

  const content = synthFile(service, "src/configuration.ts");
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  // console.log(content);
});
