import { addDynaliteSupport } from "./dynalite-support";
import { Fracture, FractureService } from "../core";
import { synthFile } from "../util/test-util";

let fracture: Fracture;

beforeEach(() => {
  fracture = new Fracture();
});

test("Smoke test", () => {
  const service = new FractureService(fracture, { name: "test" });
  addDynaliteSupport(service);

  const content = synthFile(fracture, "services/test/jest-dynalite-config.js");
  expect(content).toMatchSnapshot();
  console.log(content);
});
