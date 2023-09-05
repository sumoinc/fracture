import { NodeProject } from "projen/lib/javascript";
import { DynamoTable } from "./dynamo-table";

test("Smoke test", () => {
  const project = new NodeProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  const table = new DynamoTable(project, { name: "foo" });
  expect(table).toBeTruthy();
});
