import { ReadResolver } from "./read-resolver";
import { synthFile, testDataService } from "../../../../util/test-util";

describe("Success Conditions", () => {
  test("Smoke test", () => {
    const service = testDataService();

    const resource = service.addResource({
      name: "bar",
    });

    new ReadResolver(service, { operation: resource.updateOperation });

    const content = synthFile(
      service,
      "src/app-sync/resolvers/ts/update-bar.ts"
    );
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});
