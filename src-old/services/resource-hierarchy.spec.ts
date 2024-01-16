import { Resource } from "./resource";
import { ResourceHierarchy } from "./resource-hierarchy";
import {
  DynamoAttribute,
  DynamoGsiType,
  DynamoTable,
  KeyType,
} from "../dynamodb";
import { testDataService } from "../util";

test("Smoke test", () => {
  const svc = testDataService();

  const table = DynamoTable.of(svc);
  const gsi = table.addGsi({
    name: "hi1",
    pk: table.sk,
    sk: new DynamoAttribute(svc, {
      name: "hi1_sk",
      keyType: KeyType.RANGE,
    }),
    type: DynamoGsiType.SECONDARY,
  });

  const one = new Resource(svc, {
    name: "one",
    attributeOptions: [
      {
        name: "name",
        required: true,
      },
    ],
  });

  const two = new Resource(svc, {
    name: "two",
    attributeOptions: [
      {
        name: "name",
        required: true,
      },
    ],
  });

  const three = new Resource(svc, {
    name: "three",
    attributeOptions: [
      {
        name: "name",
        required: true,
      },
    ],
  });

  const four = new Resource(svc, {
    name: "four",
    attributeOptions: [
      {
        name: "name",
        required: true,
      },
    ],
  });

  // define hierarchy
  const h = new ResourceHierarchy(svc, {
    gsi,
    members: [one, two, three, four],
  });

  expect(h).toBeTruthy();
});
