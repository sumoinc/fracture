import { NodeProject } from "projen/lib/javascript";
import { VtlCreateRequest } from "./create-request";
import { DataService } from "../../../services/data-service";
import { synthFile } from "../../../util/test-util";

describe("Success Conditions", () => {
  test("Smoke test", () => {
    const service = testService();

    const resource = service.addResource({
      name: "bar",
    });

    new VtlCreateRequest(service, { operation: resource.createOperation });

    const content = synthFile(
      service,
      "src/app-sync/vtl/create-bar-request.vtl"
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
