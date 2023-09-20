import { Resource } from "./resource";
import { ResourceAttribute, ResourceAttributeType } from "./resource-attribute";
import { Types } from "../generators";
import { synthFile, testDataService, testResource } from "../util/test-util";

describe("success conditions", () => {
  test("Smoke test without helper", () => {
    const resource = testResource();
    const att = new ResourceAttribute(resource.service, {
      name: "bar",
      resource,
    });
    // exists
    expect(att).toBeTruthy();
    // also contained in resource array
    expect(
      resource.attributes.findIndex((a) => {
        return a.name === att.name;
      })
    ).toBeGreaterThanOrEqual(0);
  });

  test("Smoke test with helper", () => {
    const resource = testResource();
    const att = resource.addAttribute({
      name: "bar",
    });
    // exists
    expect(att).toBeTruthy();
    // also contained in resource array
    expect(
      resource.attributes.findIndex((a) => {
        return a.name === att.name;
      })
    ).toBeGreaterThanOrEqual(0);
  });

  test("Attribute Relationships", () => {
    const service = testDataService();

    // address
    const address = new Resource(service, { name: "address" });
    address.addAttribute({ name: "street" });
    address.addAttribute({ name: "city" });

    // user
    const user = new Resource(service, { name: "user" });
    user.addAttribute({ name: "first-name" });
    user.addAttribute({ name: "last-name" });

    // user has a simgle primary address
    user.addAttribute({
      name: "primary-address",
      type: address,
    });

    // user has multiple addresses
    user.addAttribute({
      name: "addresses",
      type: ResourceAttributeType.ARRAY,
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
});

describe("failure conditions", () => {
  test("Duplicate attribute names not allowed", () => {
    const resource = testResource();

    resource.addAttribute({
      name: "foo-attr",
    });

    expect(() => {
      resource.addAttribute({
        name: "foo-attr",
      });
    }).toThrow();
  });

  test("Duplicate attribute short names not allowed", () => {
    const resource = testResource();

    resource.addAttribute({
      name: "foo-attr",
      shortName: "foo",
    });

    expect(() => {
      resource.addAttribute({
        name: "foo-other",
        shortName: "foo",
      });
    }).toThrow("shortname of");
  });
});
