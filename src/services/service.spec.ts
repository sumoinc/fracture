import { TypeScriptProject } from "projen/lib/typescript";
import { Service } from "./service";

describe("success conditions", () => {
  test("Smoke test", () => {
    const root = new TypeScriptProject({
      name: "my-project",
      defaultReleaseBranch: "main",
    });
    const service = new Service(root, {
      name: "my-project",
    });
    expect(service).toBeTruthy();
  });
});
