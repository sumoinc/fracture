import { CreateResaolver } from "./create-resolver";
import { synthFile, testDataService } from "../../../../util/test-util";

describe("Success Conditions", () => {
  test("Smoke test", () => {
    const service = testDataService();

    const resource = service.addResource({
      name: "bar",
      attributeOptions: [
        {
          name: "first-name",
          shortName: "fn",
        },
      ],
    });

    new CreateResaolver(service, { operation: resource.createOperation });

    const content = synthFile(
      service,
      "src/app-sync/resolvers/ts/create-bar.ts"
    );
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});
