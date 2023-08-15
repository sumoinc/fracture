import { GithubFractureWorkflow } from "./workflow";
import { Fracture } from "../core";
import { synthFile } from "../util/test-util";

let fracture: Fracture;

beforeEach(() => {
  fracture = new Fracture();
});

/*******************************************************************************
 * DEFAULT WORKFLOWS
 ******************************************************************************/

describe("Default workflow", () => {
  test("no args", () => {
    const workflow = new GithubFractureWorkflow(fracture, {
      name: "foo",
      branchTriggerPatterns: ["main"],
      pathTriggerPatterns: ["src/**/*"],
      deploy: true,
    });

    const content = synthFile(fracture, workflow.filePath);
    expect(content).toMatchSnapshot();
    console.log(content);
  });

  test("without turborepo", () => {
    const noTurbo = new Fracture({
      turboRepoEnabled: false,
    });
    const workflow = new GithubFractureWorkflow(noTurbo, {
      name: "foo",
      branchTriggerPatterns: ["main"],
      pathTriggerPatterns: ["src/**/*"],
      deploy: true,
    });

    const content = synthFile(noTurbo, workflow.filePath);
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});

/*******************************************************************************
 * WAVES & STAGES
 ******************************************************************************/

/*
describe.only("Waves & Stages", () => {
  test("one wave, one stage", () => {
    const fracture = new Fracture({
      name: "test-project",
      logging: {
        level: LogLevel.OFF,
      },
    });
    const pipeline = new Pipeline(fracture, {
      name: "default",
      branchTriggerPatterns: ["main"],
    });
    const workflow = new GithubFractureWorkflow(fracture, { pipeline });

    const content = synthWorkflow(workflow);
    expect(content).toMatchSnapshot();
    console.log(content);
  });
});
*/
/*******************************************************************************
 * MISC TESTS
 ******************************************************************************/
/*
test("has valid filepath", () => {
  const fracture = new Fracture({
    name: "test-project",
    logging: {
      level: LogLevel.OFF,
    },
  });
  const pipeline = new Pipeline(fracture, {
    name: "default",
    branchTriggerPatterns: ["main"],
  });
  const workflow = new GithubFractureWorkflow(fracture, {
    name: "Foo Bar Baz",
    pipeline,
  });

  expect(workflow.filePath).toBe(".github/workflows/foo-bar-baz.yml");
});
*/
/*
describe("multiple waves", () => {
  test("Workflows depend on build", () => {
    const pipeline = app.addPipeline({
      name: "default",
      branchTriggerPatterns: ["main"],
    });
    pipeline.addStage({ name: "East Coast", environment: devUsEast });
    pipeline.addStage({ name: "West Coast", environment: devUsWest });
    const workflow = new GithubFractureWorkflow(fracture, { pipeline });

    const content = synthWorkflow(workflow);
    expect(content).toMatchSnapshot();

    console.log(content);
  });
});
*/

/**
 *
 * Helper function to generate a workflow file so we can test it's structure.
 *
 */
/*
function synthWorkflow(workflow: Workflow): any {
  const snapshot = synthSnapshot(workflow.project);
  const filtered = Object.keys(snapshot)
    .filter((path) => path.match(workflow.filePath))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: snapshot[key],
      };
    }, {} as { [key: string]: any });
  return filtered[workflow.filePath];
}*/
