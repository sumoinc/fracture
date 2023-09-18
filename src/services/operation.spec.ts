import { Operation } from "./operation";
import { testResource } from "../util/test-util";

describe("success conditions", () => {
  test("Smoke test without helper", () => {
    const resource = testResource();
    const operation = new Operation(resource.service, {
      name: "save-user",
      resource,
    });

    // exists
    expect(operation).toBeTruthy();
    // also contained in array
    expect(
      resource.operations.findIndex((o) => {
        return o.name === o.name;
      })
    ).toBeGreaterThanOrEqual(0);
  });

  test("Smoke test with helper", () => {
    const resource = testResource();
    const operation = resource.addOperation({
      name: "save-user",
    });

    // exists
    expect(operation).toBeTruthy();
    // also contained in array
    expect(
      resource.operations.findIndex((o) => {
        return o.name === o.name;
      })
    ).toBeGreaterThanOrEqual(0);
  });
});

describe("crud operations", () => {
  test("Create Operation", () => {
    const operation = Operation.create(testOperationResource());

    // proper input
    expect(operation?.inputStructure).toBeTruthy();
    expect(
      JSON.stringify(operation?.inputStructure.config(), null, 2)
    ).toMatchSnapshot();

    // proper output
    expect(operation?.outputAttribute).toBeTruthy();
    expect(
      JSON.stringify(operation?.outputAttribute.config(), null, 2)
    ).toMatchSnapshot();

    //console.log(operation?.inputStructure.config());
    //console.log(operation?.outputAttribute.config());
  });

  test("Read Operation", () => {
    const operation = Operation.read(testOperationResource());

    // proper input
    expect(operation?.inputStructure).toBeTruthy();
    expect(
      JSON.stringify(operation?.inputStructure.config(), null, 2)
    ).toMatchSnapshot();

    // proper output
    expect(operation?.outputAttribute).toBeTruthy();
    expect(
      JSON.stringify(operation?.outputAttribute.config(), null, 2)
    ).toMatchSnapshot();

    //console.log(operation?.inputStructure.config());
    //console.log(operation?.outputAttribute.config());
  });

  test("Update Operation", () => {
    const operation = Operation.update(testOperationResource());

    // proper input
    expect(operation?.inputStructure).toBeTruthy();
    expect(
      JSON.stringify(operation?.inputStructure.config(), null, 2)
    ).toMatchSnapshot();

    // proper output
    expect(operation?.outputAttribute).toBeTruthy();
    expect(
      JSON.stringify(operation?.outputAttribute.config(), null, 2)
    ).toMatchSnapshot();

    // console.log(operation?.inputStructure.config());
    // console.log(operation?.outputAttribute.config());
  });

  test("Delete Operation", () => {
    const operation = Operation.delete(testOperationResource());

    // proper input
    expect(operation?.inputStructure).toBeTruthy();
    expect(
      JSON.stringify(operation?.inputStructure.config(), null, 2)
    ).toMatchSnapshot();

    // proper output
    expect(operation?.outputAttribute).toBeTruthy();
    expect(
      JSON.stringify(operation?.outputAttribute.config(), null, 2)
    ).toMatchSnapshot();

    // console.log(operation?.inputStructure.config());
    // console.log(operation?.outputAttribute.config());
  });
});

// semi complext resource for testing CRUD operations
const testOperationResource = () => {
  const resource = testResource();
  resource.addAttribute({
    name: "required-name",
    required: true,
  });
  resource.addAttribute({
    name: "optional-name",
    required: false,
  });
  return resource;
};
