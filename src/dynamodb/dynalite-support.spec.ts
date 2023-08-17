import { addDynaliteSupport } from "./dynalite-support";
import { Fracture, FractureService } from "../core";
import { synthFile } from "../util/test-util";

let fracture: Fracture;

beforeEach(() => {
  fracture = new Fracture();
});

test("Smoke test cnofig", () => {
  const service = new FractureService(fracture, { name: "test" });
  addDynaliteSupport(service);
  const configContent = synthFile(
    fracture,
    "services/test/jest-dynalite-config.js"
  );
  expect(configContent).toMatchSnapshot();
});

test("Smoke test jext", () => {
  const service = new FractureService(fracture, { name: "test" });
  addDynaliteSupport(service);
  const jestContent = synthFile(fracture, "services/test/setupBeforeEnv.ts");
  expect(jestContent).toMatchSnapshot();
  // console.log(jestContent);
});
