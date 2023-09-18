import { buildType } from "./build-type";
import { printNodes } from "./print-nodes";
import { ResourceAttributeType } from "../../../services";
import { Structure } from "../../../services/structure";
import { testDataService, testStructure } from "../../../util/test-util";

test("Smoke test", () => {
  const structure = testStructure();
  const type = buildType({ service: structure.service, structure });
  const content = printNodes([type]);
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  //console.log(content);
});

test("Generic and type param support", () => {
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
      {
        name: "customType",
        required: true,
        type: ResourceAttributeType.MAP,
        typeParameter: "map-value",
      },
    ],
  });

  const type = buildType({ service, structure });
  const content = printNodes([type]);
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  //console.log(content);
});

test("Optional and Required work", () => {
  const service = testDataService();
  const structure = new Structure(service, {
    name: "MyType",
    attributeOptions: [
      {
        name: "should-be-required",
        required: true,
      },
      {
        name: "should-be-optional",
        required: false,
      },
    ],
  });
  const type = buildType({ service, structure });
  const content = printNodes([type]);
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
});

test("All attribute types should match snapshot", () => {
  const service = testDataService();
  const attributeOptions = Object.entries(ResourceAttributeType).map(
    ([key, value]) => {
      return {
        name: key,
        type: value,
        typeParameter:
          value === ResourceAttributeType.ARRAY ||
          value === ResourceAttributeType.MAP ||
          value === ResourceAttributeType.ANY
            ? "any"
            : undefined,
      };
    }
  );
  const structure = new Structure(service, {
    name: "MyType",
    attributeOptions,
  });

  const type = buildType({ service, structure });
  const content = printNodes([type]);
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();

  // console.log(content);
});
