import { NodeProject } from "projen/lib/javascript";
import { addDynaliteSupport } from "./dynalite-support";
import { synthFile } from "../util/test-util";

test("Smoke test config", () => {
  const project = new NodeProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  addDynaliteSupport(project);
  const content = synthFile(project, "jest-dynalite-config.js");
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
});

test("Smoke test jest", () => {
  const project = new NodeProject({
    name: "my-project",
    defaultReleaseBranch: "main",
  });
  addDynaliteSupport(project);
  const content = synthFile(project, "setupBeforeEnv.ts");
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  // console.log(jestContent);
});
