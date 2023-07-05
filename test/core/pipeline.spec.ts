import { TestFracture } from "../util";

test("Smoke test", () => {
  const pipeline = new TestFracture().testPipeline();
  pipeline.synthesize();
  expect(pipeline).toBeTruthy();
});
