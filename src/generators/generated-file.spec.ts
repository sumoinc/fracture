import { GeneratedFile } from "./generated-file";
import { synthFile, testDataService } from "../util/test-util";

describe("Success conditions", () => {
  test("Smoke test", () => {
    const service = testDataService();
    new GeneratedFile(service, "foo.txt").addLine("Hello, World!");

    const content = synthFile(service, "src/foo.txt");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});
