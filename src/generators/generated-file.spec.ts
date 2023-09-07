import { TypeScriptProject } from "projen/lib/typescript";
import { GeneratedFile } from "./generated-file";
import { synthFile } from "../util/test-util";

describe("success conditions", () => {
  test("Smoke test", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });

    new GeneratedFile(project, "foo.txt").addLine("Hello, World!");

    const content = synthFile(project, "src/foo.txt");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});
