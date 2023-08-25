import { buildType } from "./build-type";
import { printNodes } from "./print-nodes";
import { Fracture, FractureService } from "../../../core";
import { Structure } from "../../../core/structure";
import { StructureAttributeType } from "../../../core/structure-attribute";

let fracture: Fracture;
let service: FractureService;

beforeEach(() => {
  fracture = new Fracture();
  service = new FractureService(fracture, { name: "foo" });
});

test("Smoke test", () => {
  const structure = new Structure(service, {
    name: "MyType",
  });
  const type = buildType({ service, structure });
  const content = printNodes([type]);
  expect(content).toMatchSnapshot();
});

test("Generic and type param support", () => {
  const structure = new Structure(service, {
    name: "MyType",
    typeParameter: "T",
    attributeOptions: [
      {
        name: "arrayType",
        required: true,
        type: StructureAttributeType.ARRAY,
        typeParameter: "T",
      },
      {
        name: "customType",
        required: true,
        type: StructureAttributeType.CUSTOM,
        typeParameter: "CustomValue",
      },
    ],
  });
  const type = buildType({ service, structure });
  const content = printNodes([type]);
  expect(content).toMatchSnapshot();
  // console.log(content);
});

test("Optional and Required work", () => {
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
  expect(content).toMatchSnapshot();
});

test("All attribute types should match snapshot", () => {
  const attributeOptions = Object.entries(StructureAttributeType).map(
    ([key, value]) => {
      return { name: key, type: value };
    }
  );
  const structure = new Structure(service, {
    name: "MyType",
    attributeOptions,
  });

  const type = buildType({ service, structure });
  const content = printNodes([type]);
  expect(content).toMatchSnapshot();

  // console.log(content);
});
