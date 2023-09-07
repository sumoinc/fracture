import { TypeScriptProject } from "projen/lib/typescript";
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
  return new DataService({
    parent: new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    }),
    name: "foo",
  });
};
