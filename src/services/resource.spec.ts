import { TypeScriptProject } from "projen/lib/typescript";
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
  return new DataService({
    parent: new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    }),
    name: "foo",
  });
};
