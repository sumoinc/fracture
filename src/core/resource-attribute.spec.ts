import { Resource } from "../../src/core/resource";
import { ResourceAttribute } from "../../src/core/resource-attribute";
import { Service } from "./fracture-service";
import { TestFracture } from "../util/test-util";

test("Smoke test", () => {
  const service = new Service(new TestFracture(), { name: "tenant" });
  const resource = new Resource(service, { name: "tenant" });
  const attribute = new ResourceAttribute(resource, { name: "foo-bar" });
  expect(attribute).toBeTruthy();
});

test("Formatting", () => {
  const service = new Service(new TestFracture(), { name: "tenant" });
  const resource = new Resource(service, { name: "tenant" });
  new ResourceAttribute(resource, {
    name: "foo-bar",
  });

  // proper casing
  // expect(attribute.name).toBe("foo-bar");
  // expect(attribute.attributeName).toBe("fooBar");
  // expect(attribute.shortName).toBe("foobar");
});
