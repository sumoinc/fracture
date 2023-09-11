import { UpdateResolver } from "./update-resolver";
import { synthFile, testDataService } from "../../../../util/test-util";

describe("Success Conditions", () => {
  test("Smoke test", () => {
    const service = testDataService();

    const resource = service.addResource({
      name: "bar",
    });

    new UpdateResolver(service, { operation: resource.updateOperation });

    const content = synthFile(
      service,
      "src/app-sync/resolvers/ts/update-bar.ts"
    );
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});
