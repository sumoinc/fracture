import { TypeScriptProject } from "projen/lib/typescript";
import { addDynaliteSupport } from "./dynalite-support";
import { synthFile } from "../util/test-util";

test("Smoke test config", () => {
  const project = new TypeScriptProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  addDynaliteSupport(project);
  const content = synthFile(project, "jest-dynalite-config.js");
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
});

test("Smoke test jest", () => {
  const project = new TypeScriptProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  addDynaliteSupport(project);
  const content = synthFile(project, "setupBeforeEnv.ts");
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  // console.log(jestContent);
});
