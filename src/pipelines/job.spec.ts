import { Pipeline } from "./pipeline";
import { Fracture } from "../core/fracture";

let fracture: Fracture;

beforeEach(() => {
  fracture = new Fracture();
});

test("Smoke test", () => {
  const pipeline = new Pipeline(fracture, {
    name: "default",
    branchTriggerPatterns: ["main"],
  });
  expect(pipeline).toBeTruthy();
});
