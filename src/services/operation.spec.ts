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

  test("Smoke test with  helper", () => {
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
