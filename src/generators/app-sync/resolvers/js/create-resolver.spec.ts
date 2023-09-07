import { NodeProject } from "projen/lib/javascript";
import { CreateResaolver } from "./create-resolver";
import { DataService } from "../../../../services/data-service";
import { synthFile } from "../../../../util/test-util";

describe("Success Conditions", () => {
  test("Smoke test", () => {
    const service = testService();

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

const testService = () => {
  const project = new NodeProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  return new DataService(project, {
    name: "foo",
  });
};