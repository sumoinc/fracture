import { TypeScriptProject } from "projen/lib/typescript";
import { DynamoTable } from "./dynamo-table";

describe("Success Conditions", () => {
  test("Smoke test", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const table = new DynamoTable(project, { name: "foo" });
    expect(table).toBeTruthy();
  });

  test("Main key pair should not appear in gsi array", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const table = new DynamoTable(project, { name: "foo" });
    expect(table.gsi).not.toContainEqual(table.keyGsi);
  });
});
