import { TypeScriptProject } from "projen/lib/typescript";
import { DataService } from "./data-service";
import { Operation } from "./operation";
import { DynamoTable } from "../dynamodb";

test("Smoke test", () => {
  const service = testService();
  const operation = new Operation(service, {
    name: "save-user",
    dynamoGsi: DynamoTable.of(service).keyGsi,
  });
  expect(operation).toBeTruthy();
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
