import { NodeProject } from "projen/lib/javascript";
import { ReadResolver } from "./read-resolver";
import { DataService } from "../../../../services/data-service";
import { synthFile } from "../../../../util/test-util";

describe("Success Conditions", () => {
  test("Smoke test", () => {
    const service = testService();

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

const testService = () => {
  const project = new NodeProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  return new DataService(project, {
    name: "foo",
  });
};
