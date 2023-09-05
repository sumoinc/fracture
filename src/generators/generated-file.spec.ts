import { NodeProject } from "projen/lib/javascript";
import { GeneratedFile } from "./generated-file";
import { synthFile } from "../util/test-util";

describe("success conditions", () => {
  test("Smoke test", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });

    new GeneratedFile(project, "foo.txt").addLine("Hello, World!");

    const content = synthFile(project, "src/generated/foo.txt");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});
