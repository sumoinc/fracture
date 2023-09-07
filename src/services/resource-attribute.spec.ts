import { TypeScriptProject } from "projen/lib/typescript";
import { DataService } from "./data-service";
import { ResourceAttribute } from "./resource-attribute";

test("Smoke test", () => {
  const service = testService();
  const att = new ResourceAttribute(service, { name: "bar" });
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
