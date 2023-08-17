import { Pipeline } from "./pipeline";
import { Fracture } from "../core/fracture";
import { synthFile } from "../util/test-util";

let fracture: Fracture;

beforeEach(() => {
  fracture = new Fracture();
});

test("Smoke test", () => {
  const pipeline = new Pipeline(fracture, {
    name: "foo",
    branchTriggerPatterns: ["main"],
  });
  expect(pipeline).toBeTruthy();

  const content = synthFile(fracture, ".github/workflows/foo.yml");
  expect(content).toMatchSnapshot();
  // console.log(content);
});

/*
test("able to add job", () => {
  const pipeline = new Pipeline(fracture, {
    name: "default",
    branchTriggerPatterns: ["main"],
  });
  const job = pipeline.addJob({ name: "build" });
  expect(job).toBeTruthy();
});
*/
