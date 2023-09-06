import { NodeProject } from "projen/lib/javascript";
import { GenerateConfigurations } from "./configurations";
import { DataService } from "../../services/data-service";
import { synthFile } from "../../util/test-util";

test("Smoke test", () => {
  const service = testService();
  new GenerateConfigurations(service);

  const content = synthFile(service, "src/configurations.ts");
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  // console.log(content);
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
