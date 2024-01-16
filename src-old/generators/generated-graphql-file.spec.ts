import { GeneratedGraphQlFile } from "./generated-graphql-file";
import { synthFile, testDataService } from "../util/test-util";

describe("Success Conditions", () => {
  test("Smoke test - default name", () => {
    const service = testDataService();

    new GeneratedGraphQlFile(service);

    const content = synthFile(service, "src/schema.graphql");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test("Smoke test - custom name", () => {
    const service = testDataService();

    new GeneratedGraphQlFile(service, "foo.graphql");

    const content = synthFile(service, "src/foo.graphql");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });
});

describe("Failure Conditions", () => {
  test("Wrong file extension", () => {
    expect(() => {
      new GeneratedGraphQlFile(testDataService(), "foo.ts");
    }).toThrow("extension");
  });
});
