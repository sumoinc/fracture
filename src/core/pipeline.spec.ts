import { Fracture } from "./fracture";
import { Pipeline } from "./pipeline";

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
