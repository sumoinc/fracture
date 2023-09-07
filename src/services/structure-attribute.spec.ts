import { TypeScriptProject } from "projen/lib/typescript";
import { DataService } from "./data-service";
import { StructureAttribute } from "./structure-attribute";

test("Smoke test", () => {
  const service = testService();
  const att = new StructureAttribute(service, { name: "bar" });
  expect(att).toBeTruthy();
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
