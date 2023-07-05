import { TestFracture } from "../util";

test("Smoke test", () => {
  const stage = new TestFracture().testStage();
  stage.synthesize();
  expect(stage).toBeTruthy();
});
