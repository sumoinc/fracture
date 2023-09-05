import { GenerateKitchenSink } from "./generate-kitchen-sink";
import { FractureService } from "../core";
import { Fracture } from "../core/fracture.ts-disabled";
import { synthFiles } from "../util/test-util";

describe("success conditions", () => {
  test("Smoke test", () => {
    const fracture = new Fracture();
    const service = new FractureService(fracture, {
      name: "my-service",
    });
    expect(service).toBeTruthy();

    new GenerateKitchenSink(fracture);

    // snapshot all files.
    const content = synthFiles(fracture, "");
    const fileList = Object.keys(content);
    expect(fileList).toMatchSnapshot();

    //console.log(fileList);
  });
});
