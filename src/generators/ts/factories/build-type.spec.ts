import { NodeProject } from "projen/lib/javascript";
import { buildType } from "./build-type";
import { printNodes } from "./print-nodes";
import { DataService } from "../../../services/data-service";
import { Structure } from "../../../services/structure";
import { StructureAttributeType } from "../../../services/structure-attribute";

test("Smoke test", () => {
  const service = testService();
  const structure = new Structure(service, {
    name: "MyType",
  });
  const type = buildType({ service, structure });
  const content = printNodes([type]);
  expect(content).toMatchSnapshot();
});

test("Generic and type param support", () => {
  const service = testService();
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
  const service = testService();
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
  const service = testService();
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

const testService = () => {
  const project = new NodeProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  return new DataService(project, {
    name: "foo",
  });
};
