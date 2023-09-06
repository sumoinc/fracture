import { NodeProject } from "projen/lib/javascript";
import { GeneratedTypescriptFile } from "./generated-typescript-file";
import { synthFile } from "../util/test-util";

describe("success conditions", () => {
  test("Smoke test", () => {
    const project = new NodeProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });

    new GeneratedTypescriptFile(project, "foo.ts").addLine("Hello, World!");

    const content = synthFile(project, "src/generated/foo.ts");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});
