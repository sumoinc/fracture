import { NodeProject } from "projen/lib/javascript";
import { DataService } from "./data-service";
import { StructureAttribute } from "./structure-attribute";

test("Smoke test", () => {
  const service = testService();
  const att = new StructureAttribute(service, { name: "bar" });
  expect(att).toBeTruthy();
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
