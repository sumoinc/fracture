import { addDynaliteSupport } from "./dynalite-support";
import { synthFile, testDataService } from "../util/test-util";

test("Smoke test config", () => {
  const service = testDataService();
  addDynaliteSupport(service);
  const content = synthFile(service, "jest-dynalite-config.js");
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
});

test("Smoke test jest", () => {
  const service = testDataService();
  addDynaliteSupport(service);
  const content = synthFile(service, "setupBeforeEnv.ts");
  expect(content).toBeTruthy();
  expect(content).toMatchSnapshot();
  // console.log(jestContent);
});
