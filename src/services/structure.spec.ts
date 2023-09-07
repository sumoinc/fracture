import { TypeScriptProject } from "projen/lib/typescript";
import { DataService } from "./data-service";
import { Structure } from "./structure";

test("Smoke test", () => {
  const service = testService();
  const structure = new Structure(service, { name: "bar" });
  expect(structure).toBeTruthy();
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
