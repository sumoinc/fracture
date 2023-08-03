import { LogLevel } from "projen";
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
    logging: {
      level: LogLevel.OFF,
    },
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
    branchTriggerPatterns: ["feature/*"],
  });
  featurePipeline.addStage({ name: "East Coast", environment: devUsEast });
  featurePipeline.addStage({ name: "West Coast", environment: devUsWest });
});

/*******************************************************************************
 * TASK TEST
 ******************************************************************************/

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
