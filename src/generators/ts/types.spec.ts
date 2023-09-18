import { Types } from "./types";
import { Operation, Resource, ResourceAttributeType } from "../../services";
import { synthFile, testResource } from "../../util/test-util";

test("Resource formatting test", () => {
  const resource = complexResource();
  new Types(resource.service);
  const content = synthFile(resource.service, "src/types.ts");
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  //console.log(content);
});

describe("Operations", () => {
  test("Create", () => {
    const resource = complexResource();
    /*const operation = */ Operation.create(resource);
    new Types(resource.service);

    const content = synthFile(resource.service, "src/types.ts");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(content);
    //console.log(JSON.stringify(operation.config(), null, 2));
  });
});

export const complexResource = () => {
  const resource = testResource();
  resource.addAttribute({
    name: "first-name",
    shortName: "fn",
  });
  resource.addAttribute({
    name: "last-name",
    shortName: "ln",
  });
  resource.addAttribute({
    name: "height",
    shortName: "ht",
    type: ResourceAttributeType.INT,
  });
  resource.addAttribute({
    name: "is-frog",
    shortName: "if",
    type: ResourceAttributeType.BOOLEAN,
  });

  // related resource
  const dougResource = new Resource(resource.service, {
    name: "doug",
    attributeOptions: [
      {
        name: "name",
      },
    ],
  });

  resource.addAttribute({
    name: "one-doug",
    shortName: "od",
    type: dougResource,
  });
  resource.addAttribute({
    name: "array-of-doug",
    shortName: "ad",
    type: ResourceAttributeType.ARRAY,
    typeParameter: dougResource,
  });
  resource.addAttribute({
    name: "map-of-doug",
    shortName: "md",
    type: ResourceAttributeType.MAP,
    typeParameter: dougResource,
  });

  return resource;
};
