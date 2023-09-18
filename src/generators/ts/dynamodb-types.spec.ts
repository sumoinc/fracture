import { DynamoDbTypes } from "./dynamodb-types";
import { complexResource } from "./types.spec";
import { Operation } from "../../services";
import { synthFile } from "../../util/test-util";

test("Resource formatting test", () => {
  const resource = complexResource();
  new DynamoDbTypes(resource.service);
  const content = synthFile(resource.service, "src/dynamodb-types.ts");
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  //console.log(content);
});

describe("Operations", () => {
  test("Create", () => {
    const resource = complexResource();
    /*const operation = */ Operation.create(resource);
    new DynamoDbTypes(resource.service);

    const content = synthFile(resource.service, "src/dynamodb-types.ts");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
    // console.log(JSON.stringify(operation.config(), null, 2));
  });
});
