import {
  Operation,
  OPERATION_SUB_TYPE,
  OPERATION_TYPE,
} from "../../src/core/operation";
import { Resource } from "../../src/core/resource";
import { ResourceAttribute } from "../../src/core/resource-attribute";
import { Service } from "../../src/core/service";
import { TestFracture } from "../util";

const myService = () => {
  return new Service(new TestFracture(), { name: "tenant" });
};

const myResource = () => {
  const resource = new Resource(myService(), { name: "person" });
  new ResourceAttribute(resource, { name: "my-name", isLookup: true });
  return resource;
};

test("Smoke test", () => {
  const resource = myResource();
  expect(resource).toBeTruthy();
});

test("Geneates external keys", () => {
  const resource = myResource();
  const readOperation = new Operation(myResource(), {
    operationType: OPERATION_TYPE.MUTATION,
    operationSubType: OPERATION_SUB_TYPE.READ_ONE,
  });
  const externalKeys =
    resource.externalKeyAttributesForOperation(readOperation);
  const externalKeyNames = externalKeys.map((a) => a.name);
  expect(externalKeyNames).toEqual(["id"]);
});
