import { Resource } from "./resource";
import { ResourceAttribute, ResourceAttributeType } from "./resource-attribute";
import { Types } from "../generators";
import { synthFile, testDataService } from "../util/test-util";

test("Smoke test", () => {
  const service = testDataService();
  const att = new ResourceAttribute(service, { name: "bar" });
  expect(att).toBeTruthy();
});

test("Attribute Relationships", () => {
  const service = testDataService();

  // address for user
  const address = new Resource(service, { name: "address" });
  address.addAttribute({ name: "street" });
  address.addAttribute({ name: "city" });

  // user has many addresses
  const user = new Resource(service, { name: "user" });
  user.addAttribute({ name: "first-name" });
  user.addAttribute({ name: "last-name" });
  user.addAttribute({
    name: "primaryAddress",
    type: address,
  });
  user.addAttribute({
    name: "addresses",
    type: ResourceAttributeType.ARRAY,
    typeParameter: address,
  });
  user.addAttribute({
    name: "address-map",
    type: ResourceAttributeType.MAP,
    typeParameter: address,
  });

  expect(address).toBeTruthy();
  expect(user).toBeTruthy();

  // type should look right in ts outputs
  new Types(service);
  const content = synthFile(service, "src/types.ts");
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  //console.log(content);
});

test("Attribute Relationships", () => {
  const service = testDataService();
  const cal = new Resource(service, {
    name: "calendar",
    attributeOptions: [
      {
        name: "name",
        shortName: "nn",
      },
      {
        name: "description",
        shortName: "ds",
      },
    ],
  });

  const evt = new Resource(service, {
    name: "calendar-event",
    attributeOptions: [
      {
        name: "name",
        shortName: "nn",
      },
    ],
  });

  cal.addAttribute({
    name: "events",
    shortName: "ev",
    type: ResourceAttributeType.ARRAY,
    typeParameter: evt,
  });

  expect(cal).toBeTruthy();
  expect(evt).toBeTruthy();

  // type should look right in ts outputs
  new Types(service);
  const content = synthFile(service, "src/types.ts");
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  //console.log(content);
});
