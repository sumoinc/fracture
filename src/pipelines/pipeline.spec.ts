import { Pipeline } from "./pipeline";
import { Fracture } from "../core/fracture";
import { synthFile } from "../util/test-util";

describe("success conditions", () => {
  test("Smoke test", () => {
    const fracture = new Fracture();
    const pipeline = new Pipeline(fracture, {
      branchName: "foo",
    });
    expect(pipeline).toBeTruthy();

    const content = synthFile(
      fracture,
      `.github/workflows/${pipeline.name}.yml`
    );
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});

describe("failure conditions", () => {
  test("duplicate branch", () => {
    const fracture = new Fracture();
    expect(() => {
      new Pipeline(fracture, {
        branchName: "main",
      });
    }).toThrow("Duplicate pipeline for branch name");
  });
});
