import { synthSnapshot } from "projen/lib/util/synth";
import { Fracture } from "../../src/core/fracture";
import { DEPLOY_TASK_PREFIX } from "../../src/core/pipeline-workflow";
import { TestFracture } from "../util";

describe("Task tests", () => {
  test("Generates expected task", () => {
    const p = new TestFracture();
    const stage = p.testStage();

    const snapshot = synthSnapshot(p);

    console.log(snapshot[".projen/tasks.json"].tasks);

    expect(
      snapshot[".projen/tasks.json"].tasks[
        `${DEPLOY_TASK_PREFIX}:${stage.name}`
      ]
    ).toBeDefined();
  });
});

describe.only("workflow file tests", () => {
  test("Generates expected pipeline", () => {
    const p = new TestFracture();
    const pipeline = p.testPipeline();
    p.testStage();

    const workflows = synthWorkflows(p);

    const fileContent =
      workflows[`.github/workflows/${pipeline.deployName}.yml`];
    console.log(workflows[`.github/workflows/${pipeline.deployName}.yml`]);
    expect(fileContent).toBeDefined();
    expect(fileContent).toMatchSnapshot();
  });
});

function synthWorkflows(p: Fracture): any {
  const snapshot = synthSnapshot(p);
  const filtered = Object.keys(snapshot)
    .filter((path) => path.startsWith(".github/workflows/"))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: snapshot[key],
      };
    }, {});
  return filtered;
}
