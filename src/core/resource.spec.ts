import { Resource } from "../../src/core/resource";
import { ResourceAttribute } from "../../src/core/resource-attribute";
import { Service } from "./fracture-service";
import { TestFracture } from "../util/test-util";

const myService = () => {
  return new Service(new TestFracture(), { name: "tenant" });
};

const myResource = () => {
  const resource = new Resource(myService(), { name: "person" });
  const name = new ResourceAttribute(resource, {
    name: "my-name",
    isRequired: true,
  });
  resource.addLookupSource(name);
  return resource;
};

test("Smoke test", () => {
  const resource = myResource();
  expect(resource).toBeTruthy();
});

test("Knows it's pk source components", () => {
  const resource = myResource();

  const pkNames = resource.partitionKeySources.map((a) => {
    return a.name;
  });

  expect(pkNames).toEqual(["id"]);
});

test("Knows it's sk source components", () => {
  const resource = myResource();

  const pkNames = resource.sortKeySources.map((a) => {
    return a.name;
  });

  expect(pkNames).toEqual(["type", "version"]);
});
