import { NodeProject } from "projen/lib/javascript";
import { DataService } from "./data-service";
import { Structure } from "./structure";

test("Smoke test", () => {
  const service = testService();
  const structure = new Structure(service, { name: "bar" });
  expect(structure).toBeTruthy();
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
