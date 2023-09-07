import { TypeScriptProject } from "projen/lib/typescript";
import { KitchenSink } from "./kitchen-sink";
import { DataService } from "../services/data-service";
import { synthFiles } from "../util/test-util";

describe("Success conditions", () => {
  test("Synth files match", () => {
    const service = testService();
    service.addResource({
      name: "bar",
    });
    new KitchenSink(service);

    // snapshot all files.
    const content = synthFiles(service, "");
    const fileList = Object.keys(content);
    expect(fileList).toMatchSnapshot();
    // console.log(JSON.stringify(fileList, null, 2));
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
