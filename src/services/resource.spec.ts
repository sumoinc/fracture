import { Resource } from "./resource";
import { Types } from "../generators";
import { synthFile, testDataService } from "../util/test-util";

describe("success conditions", () => {
  test("Smoke test", () => {
    const service = testDataService();
    const resource = new Resource(service, { name: "foo" });
    expect(resource).toBeTruthy();
    expect(resource.config()).toMatchSnapshot();
  });

  test("Able to add attribute", () => {
    const service = testDataService();
    const resource = new Resource(service, { name: "foo" });
    const attribute = resource.addAttribute({ name: "bar" });
    expect(attribute).toBeTruthy();
  });

  test("Able to add related array", () => {
    const service = testDataService();
    const fooResource = new Resource(service, { name: "foo" });
    const barResource = new Resource(service, { name: "bar" });
    fooResource.addArrayOf(barResource);

    new Types(service);
    const content = synthFile(service, "src/types.ts");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(content);
  });

  test("Able to add related resource", () => {
    const service = testDataService();
    const fooResource = new Resource(service, { name: "foo" });
    const barResource = new Resource(service, { name: "bar" });
    fooResource.addOneOf(barResource);

    new Types(service);
    const content = synthFile(service, "src/types.ts");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});

test("Able to override relationship names related array", () => {
  const service = testDataService();
  const fooResource = new Resource(service, { name: "foo" });
  const barResource = new Resource(service, { name: "bar" });
  fooResource.addArrayOf(barResource, { name: "bazzes", shortName: "z" });

  new Types(service);
  const content = synthFile(service, "src/types.ts");
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  //console.log(content);
});

describe("failure conditions", () => {
  test("Duplicate resources not allowed", () => {
    const service = testDataService();

    new Resource(service, { name: "foo" });

    expect(() => {
      new Resource(service, { name: "foo" });
    }).toThrow();
  });
});
