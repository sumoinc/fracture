import { TypeScriptProject } from "projen/lib/typescript";
import { DynamoAttribute } from "./dynamo-attribute";

test("Smoke test", () => {
  const project = new TypeScriptProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });

  const attribute = new DynamoAttribute(project, { name: "foo" });
  expect(attribute).toBeTruthy();
});
