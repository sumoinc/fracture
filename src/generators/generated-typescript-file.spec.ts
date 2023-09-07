import { TypeScriptProject } from "projen/lib/typescript";
import { GeneratedTypescriptFile } from "./generated-typescript-file";
import { synthFile } from "../util/test-util";

describe("success conditions", () => {
  test("Smoke test", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });

    new GeneratedTypescriptFile(project, "foo.ts").addLine("Hello, World!");

    const content = synthFile(project, "src/foo.ts");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});

describe("Failure Conditions", () => {
  test("Wrong file extension", () => {
    const project = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });

    expect(() => {
      new GeneratedTypescriptFile(project, "foo.wrong").addLine(
        "Hello, World!"
      );
    }).toThrow("extension");
  });
});
