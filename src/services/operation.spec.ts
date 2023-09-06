import { NodeProject } from "projen/lib/javascript";
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
  const project = new NodeProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  return new DataService(project, {
    name: "foo",
  });
};
