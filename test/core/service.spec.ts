import { Service } from "../../src/core/service";
import { TestFracture } from "../util";

test("Smoke test", () => {
  const service = new Service(new TestFracture(), { name: "foo" });
  service.build();
  expect(service).toBeTruthy();
});

test("Can add resources", () => {
  const service = new Service(new TestFracture(), { name: "foo" });
  expect(service.resources.length).toBe(0);
  service.addResource({ name: "bar" });
  expect(service.resources.length).toBe(1);
});
