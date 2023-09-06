import { NodeProject } from "projen/lib/javascript";
import { VtlUpdateResponse } from "./update-response";
import { DataService } from "../../../services/data-service";
import { synthFile } from "../../../util/test-util";

describe("Success Conditions", () => {
  test("Smoke test", () => {
    const service = testService();

    const resource = service.addResource({
      name: "bar",
    });

    new VtlUpdateResponse(service, { operation: resource.updateOperation });

    const content = synthFile(
      service,
      "src/app-sync/vtl/update-bar-response.vtl"
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
