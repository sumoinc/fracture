import { Resource } from "./resource";
import { testDataService } from "../util/test-util";

test("Smoke test", () => {
  const service = testDataService();
  const resource = new Resource(service, { name: "foo" });
  expect(resource).toBeTruthy();
});

test("Able to add attribute", () => {
  const service = testDataService();
  const resource = new Resource(service, { name: "foo" });
  const attribute = resource.addAttribute({ name: "bar" });
  expect(attribute).toBeTruthy();
});
