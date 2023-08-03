import { Service } from "../../src/core/service";
import { TestFracture } from "../util/test-util";

test("Smoke test", () => {
  const service = new Service(new TestFracture(), { name: "foo" });
  expect(service).toBeTruthy();
});

test("Can add resources", () => {
  const service = new Service(new TestFracture(), { name: "foo" });
  expect(service.resources.length).toBe(0);
  service.addResource({ name: "bar" });
  expect(service.resources.length).toBe(1);
});

test("Don't duplicate services", () => {
  const fracture = new TestFracture();
  new Service(fracture, { name: "foo" });
  new Service(fracture, { name: "bar" });
  expect(fracture.services[0].name).toBe("foo");
  expect(fracture.services[1].name).toBe("bar");
});
