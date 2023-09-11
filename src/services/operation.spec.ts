import { Operation } from "./operation";
import { DynamoTable } from "../dynamodb";
import { testDataService } from "../util/test-util";

test("Smoke test", () => {
  const service = testDataService();
  const operation = new Operation(service, {
    name: "save-user",
    dynamoGsi: DynamoTable.of(service).keyGsi,
  });
  expect(operation).toBeTruthy();
});
