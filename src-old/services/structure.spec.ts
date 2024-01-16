import { ResourceAttributeType } from "./resource-attribute";
import { Structure } from "./structure";
import {
  testDataService,
  testOperation,
  testResource,
} from "../util/test-util";

describe("success conditions", () => {
  test("Smoke test without helper", () => {
    const service = testDataService();
    const structure = new Structure(service, {
      name: "bar",
    });

    // exists
    expect(structure).toBeTruthy();
    // also contained in structure array
    expect(
      service.structures.findIndex((s) => {
        return s.name === s.name;
      })
    ).toBeGreaterThanOrEqual(0);
  });

  test("Smoke test with service helper", () => {
    const service = testDataService();
    const structure = service.addStructure({
      name: "bar",
    });

    // exists
    expect(structure).toBeTruthy();
    // also contained in structure array
    expect(
      service.structures.findIndex((s) => {
        return s.name === s.name;
      })
    ).toBeGreaterThanOrEqual(0);
  });

  test("Smoke test with resource helper", () => {
    const resource = testResource();
    const structure = resource.addStructure({
      name: "bar",
    });

    // exists
    expect(structure).toBeTruthy();
    // contained in service array
    expect(
      resource.service.structures.findIndex((s) => {
        return s.name === s.name;
      })
    ).toBeGreaterThanOrEqual(0);
  });

  test("Smoke test with operation helper", () => {
    const operation = testOperation();
    const structure = operation.addStructure({
      name: "bar",
    });

    // exists
    expect(structure).toBeTruthy();
    // contained in service array
    expect(
      structure.service.structures.findIndex((s) => {
        return s.name === s.name;
      })
    ).toBeGreaterThanOrEqual(0);
  });

  test("Smoke test with attribute args", () => {
    const service = testDataService();
    const structure = new Structure(service, {
      name: "MyType",
      typeParameter: "T",
      attributeOptions: [
        {
          name: "arrayType",
          required: true,
          type: ResourceAttributeType.ARRAY,
          typeParameter: "t",
        },
      ],
    });

    // exists
    expect(structure).toBeTruthy();
    // should only have one attribute
    expect(structure.attributes.length).toBe(1);
    // contained in service array
    expect(
      structure.service.structures.findIndex((s) => {
        return s.name === s.name;
      })
    ).toBeGreaterThanOrEqual(0);
  });
});

describe("failure conditions", () => {
  test("Duplicate structures not allowed - service level", () => {
    const service = testDataService();
    service.addStructure({
      name: "bar",
    });

    expect(() => {
      service.addStructure({
        name: "bar",
      });
    }).toThrow();
  });

  test("Duplicate structures not allowed - resource level", () => {
    const resource = testResource();
    resource.addStructure({
      name: "bar",
    });

    expect(() => {
      resource.addStructure({
        name: "bar",
      });
    }).toThrow();
  });

  test("Duplicate structures not allowed - operation level", () => {
    const operation = testOperation();
    operation.addStructure({
      name: "bar",
    });

    expect(() => {
      operation.addStructure({
        name: "bar",
      });
    }).toThrow();
  });
});
