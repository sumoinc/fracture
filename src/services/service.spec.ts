import { TypeScriptProject } from "projen/lib/typescript";
import { Service } from "./service";

describe("success conditions", () => {
  test("Smoke test", () => {
    const service = new Service({
      parent: new TypeScriptProject({
        name: "my-project",
        defaultReleaseBranch: "main",
      }),
      name: "my-project",
    });
    expect(service).toBeTruthy();
  });
});
