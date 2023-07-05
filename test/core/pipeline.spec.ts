import { synthSnapshot } from "projen/lib/util/synth";
import { Fracture } from "../../src/core/fracture";
import { TestFracture } from "../util";

test("Smoke test", () => {
  const pipeline = new TestFracture().testPipeline();
  pipeline.synthesize();
  expect(pipeline).toBeTruthy();
});
