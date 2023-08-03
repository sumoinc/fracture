import { synthSnapshot } from "projen/lib/util/synth";
import { Fracture } from "./fracture";
import { DEPLOY_TASK_PREFIX } from "./pipeline-workflow";
import { REGION_IDENTITIER } from "./region";

/*******************************************************************************
 * TEST SETUP
 ******************************************************************************/

let fracture: Fracture;

beforeEach(() => {
  fracture = new Fracture({
    name: "test-project",
  });
  const org = fracture.addOrganization({ id: "test-org" });
  const account = org.addAccount({ id: "id", name: "test-account" });
  const devUsEast = fracture.addEnvironment({
    account,
    region: REGION_IDENTITIER.US_EAST_1,
  });
  const devUsWest = fracture.addEnvironment({
    account,
    region: REGION_IDENTITIER.US_WEST_2,
  });
  const app = fracture.addApp({ name: "identity-service" });
  const featurePipeline = app.addPipeline({
    name: "feature-branch",
    branchTriggerPattern: "feature/*",
  });
  featurePipeline.addStage({ name: "East Coast", environment: devUsEast });
  featurePipeline.addStage({ name: "West Coast", environment: devUsWest });
});

/*******************************************************************************
 * SMOKE TEST
 ******************************************************************************/

test("Smoke test", () => {
  const workflows = synthWorkflows(fracture);
  console.log(workflows);
  expect(workflows).toBeTruthy();
});

describe("Task tests", () => {
  test("Generates expected task in projen", () => {
    const snapshot = synthSnapshot(fracture);
    const tasks = snapshot[".projen/tasks.json"].tasks;

    // filter out only deployment tasks
    const deployTasks = Object.keys(tasks)
      .filter((path) => path.startsWith(DEPLOY_TASK_PREFIX))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: tasks[key],
        };
      }, {});

    expect(deployTasks).toMatchSnapshot();

    //console.log(JSON.stringify(deployTasks, null, 2));
  });
});

/*
describe("workflow file tests", () => {
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

describe("formatting", () => {
  test("Deployments depend on build", () => {});
  test("Deployments depend on branch", () => {});
});
*/

/**
 *
 * Helper function to generate a workflow file so we can test it's structure.
 *
 */

function synthWorkflows(_fracture: Fracture): any {
  const snapshot = synthSnapshot(_fracture);
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
