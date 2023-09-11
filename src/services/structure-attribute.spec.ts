import { Structure } from "./structure";
import { StructureAttribute } from "./structure-attribute";
import { testDataService, testStructure } from "../util/test-util";

describe("success conditions", () => {
  test("Smoke test without helper", () => {
    const structure = testStructure();
    const att = new StructureAttribute(structure.service, {
      name: "bar",
      structure,
    });

    // exists
    expect(att).toBeTruthy();
    // also contained in resource array
    expect(
      structure.attributes.findIndex((a) => {
        return a.name === att.name;
      })
    ).toBeGreaterThanOrEqual(0);
  });

  test("Smoke test with helper", () => {
    const structure = testStructure();
    const att = structure.addAttribute({
      name: "bar",
    });
    // exists
    expect(att).toBeTruthy();
    // also contained in resource array
    expect(
      structure.attributes.findIndex((a) => {
        return a.name === att.name;
      })
    ).toBeGreaterThanOrEqual(0);
  });
});

describe("failure conditions", () => {
  test("Duplicate attributes not allowed", () => {
    const structure = testStructure();

    structure.addAttribute({
      name: "foo-attr",
    });

    expect(() => {
      structure.addAttribute({
        name: "foo-attr",
      });
    }).toThrow();
  });

  test("Duplicate attributes not allowed - using attribute args", () => {
    const service = testDataService();

    expect(() => {
      new Structure(service, {
        name: "MyType",
        typeParameter: "T",
        attributeOptions: [
          {
            name: "foo",
          },
          {
            name: "foo",
          },
        ],
      });
    }).toThrow();
  });
});
