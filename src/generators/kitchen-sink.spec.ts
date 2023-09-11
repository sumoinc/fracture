import { KitchenSink } from "./kitchen-sink";
import { synthFiles, testDataService } from "../util/test-util";

describe("Success conditions", () => {
  test("Synth files match", () => {
    const service = testDataService();
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
