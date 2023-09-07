import { TypeScriptProject } from "projen/lib/typescript";
import { UpdateResolver } from "./update-resolver";
import { DataService } from "../../../../services/data-service";
import { synthFile } from "../../../../util/test-util";

describe("Success Conditions", () => {
  test("Smoke test", () => {
    const service = testService();

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

const testService = () => {
  return new DataService({
    parent: new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    }),
    name: "foo",
  });
};
