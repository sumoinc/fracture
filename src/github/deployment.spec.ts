import { LogLevel } from "projen";
import { synthSnapshot } from "projen/lib/util/synth";
import { Deployment } from "./deployment";
import { Fracture, Pipeline } from "../core";

/*******************************************************************************
 * DEFAULT WORKFLOWS
 ******************************************************************************/

describe("Default workflow", () => {
  test("no args turborepo", () => {
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
    const workflow = new Deployment(fracture, { pipeline });

    const content = synthWorkflow(workflow);
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test("with TurboRepo", () => {
    const fracture = new Fracture({
      name: "test-project",
      logging: {
        level: LogLevel.OFF,
      },
      turboRepoEnabled: false,
    });
    const pipeline = new Pipeline(fracture, {
      name: "default",
      branchTriggerPatterns: ["main"],
    });
    const workflow = new Deployment(fracture, {
      name: "with TurboRepo",
      pipeline,
    });

    const content = synthWorkflow(workflow);
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
  test("without TurboRepo", () => {
    const fracture = new Fracture({
      name: "test-project",
      logging: {
        level: LogLevel.OFF,
      },
      turboRepoEnabled: true,
    });
    const pipeline = new Pipeline(fracture, {
      name: "default",
      branchTriggerPatterns: ["main"],
    });
    const workflow = new Deployment(fracture, {
      name: "without TurboRepo",
      pipeline,
    });

    const content = synthWorkflow(workflow);
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});

/*******************************************************************************
 * WAVES & STAGES
 ******************************************************************************/

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
    const workflow = new Deployment(fracture, { pipeline });

    const content = synthWorkflow(workflow);
    expect(content).toMatchSnapshot();
    console.log(content);
  });
});

/*******************************************************************************
 * MISC TESTS
 ******************************************************************************/

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
  const workflow = new Deployment(fracture, {
    name: "Foo Bar Baz",
    pipeline,
  });

  expect(workflow.filePath).toBe(".github/workflows/foo-bar-baz.yml");
});

/*
describe("multiple waves", () => {
  test("Deployments depend on build", () => {
    const pipeline = app.addPipeline({
      name: "default",
      branchTriggerPatterns: ["main"],
    });
    pipeline.addStage({ name: "East Coast", environment: devUsEast });
    pipeline.addStage({ name: "West Coast", environment: devUsWest });
    const workflow = new Deployment(fracture, { pipeline });

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

function synthWorkflow(workflow: Deployment): any {
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
}
