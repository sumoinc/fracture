import { NodeProject } from "projen/lib/javascript";
import { GeneratedVtlFile } from "./generated-vtl-file";
import { synthFile } from "../util/test-util";

describe("Success Conditions", () => {
  test("Smoke test", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });

    new GeneratedVtlFile(project, "foo.vtl").addLine("Hello, World!");

    const content = synthFile(project, "src/foo.vtl");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});

describe("Failure Conditions", () => {
  test("Wrong file extension", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });

    expect(() => {
      new GeneratedVtlFile(project, "foo.ts").addLine("Hello, World!");
    }).toThrow("extension");
  });
});
