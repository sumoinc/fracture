import { NodeProject } from "projen/lib/javascript";
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
  const project = new NodeProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  return new DataService(project, {
    name: "foo",
  });
};
