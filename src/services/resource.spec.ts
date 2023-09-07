import { NodeProject } from "projen/lib/javascript";
import { DataService } from "./data-service";
import { Resource } from "./resource";

test("Smoke test", () => {
  const service = testService();
  const resource = new Resource(service, { name: "foo" });
  expect(resource).toBeTruthy();
});

test("Able to add attribute", () => {
  const service = testService();
  const resource = new Resource(service, { name: "foo" });
  const attribute = resource.addAttribute({ name: "bar" });
  expect(attribute).toBeTruthy();
});

const testService = () => {
  const project = new NodeProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  return new DataService(project, {
    name: "foo",
  });
};
