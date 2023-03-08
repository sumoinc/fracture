import {
  Operation,
  OPERATION_SUB_TYPE,
  OPERATION_TYPE,
} from "../../src/core/operation";
import { Resource } from "../../src/core/resource";
import { ResourceAttribute } from "../../src/core/resource-attribute";
import { Service } from "../../src/core/service";
import { TestFracture } from "../util";

describe("Create Operation", () => {
  const createOperation = () => {
    const service = new Service(new TestFracture(), { name: "tenant" });
    const resource = new Resource(service, { name: "person" });
    new ResourceAttribute(resource, { name: "my-name" });
    return new Operation(resource, {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.CREATE_ONE,
    });
  };

  test("Create Operation", () => {
    const operation = createOperation();
    console.log("operation name:", operation.name);

    //const { inputStructure } = operation;
    // operation.inputStructure.attributes.forEach((attribute) => {
    //   console.log("data att:", attribute.name);
    // });
    // operation.generatedAttributes.forEach((attribute) => {
    //   console.log("generated att:", attribute.name);
    // });

    //console.log(inputAttributeNames);

    // only the one data attribute is an input on create actions
    //expect(inputAttributeNames).toEqual(["my-name"]);
  });
});
