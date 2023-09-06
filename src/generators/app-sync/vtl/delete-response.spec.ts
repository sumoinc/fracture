import { NodeProject } from "projen/lib/javascript";
import { VtlDeleteResponse } from "./delete-response";
import { DataService } from "../../../services/data-service";
import { synthFile } from "../../../util/test-util";

describe("Success Conditions", () => {
  test("Smoke test", () => {
    const service = testService();
    const resource = service.addResource({
      name: "bar",
    });

    new VtlDeleteResponse(service, { operation: resource.deleteOperation });

    const content = synthFile(
      service,
      "src/app-sync/vtl/delete-bar-response.vtl"
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
