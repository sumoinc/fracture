import { Resource } from "../../src/core/resource";
import { Service } from "../../src/core/service";
import { TestFracture } from "../util";

test("Smoke test", () => {
  const service = new Service(new TestFracture(), { name: "tenant" });
  const resource = new Resource(service, { name: "foo" });
  expect(resource).toBeTruthy();
});
