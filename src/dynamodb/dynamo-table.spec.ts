import { TypeScriptProject } from "projen/lib/typescript";
import { DynamoTable } from "./dynamo-table";

test("Smoke test", () => {
  const project = new TypeScriptProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  const table = new DynamoTable(project, { name: "foo" });
  expect(table).toBeTruthy();
});
