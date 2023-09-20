import { DynamoDbTypes } from "./dynamodb-types";
import { complexService, synthFile } from "../../util/test-util";

test("Resource formatting test", () => {
  const service = complexService();
  new DynamoDbTypes(service);
  const content = synthFile(service, "src/dynamodb-types.ts");
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  //console.log(content);
});
