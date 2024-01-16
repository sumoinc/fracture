import { TypeScriptProject } from "projen/lib/typescript";
import { DynamoAttribute } from "./dynamo-attribute";
import { DynamoGsi } from "./dynamo-gsi";

test("Smoke test", () => {
  const project = new TypeScriptProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  const gsi = new DynamoGsi(project, {
    name: "foo",
    pk: new DynamoAttribute(project, { name: "pk" }),
    sk: new DynamoAttribute(project, { name: "sk" }),
  });
  expect(gsi).toBeTruthy();
});
