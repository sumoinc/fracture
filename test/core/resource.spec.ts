import { Resource } from "../../src/core/resource";
import { ResourceAttribute } from "../../src/core/resource-attribute";
import { Service } from "../../src/core/service";
import { TestFracture } from "../util";

const myService = () => {
  return new Service(new TestFracture(), { name: "tenant" });
};

const myResource = () => {
  const resource = new Resource(myService(), { name: "person" });
  new ResourceAttribute(resource, { name: "my-name" });
  return resource;
};

test("Smoke test", () => {
  const resource = myResource();
  expect(resource).toBeTruthy();
});
