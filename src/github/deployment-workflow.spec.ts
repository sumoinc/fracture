import { LogLevel } from "projen";
import { synthSnapshot } from "projen/lib/util/synth";
import { DeploymentWorkflow } from "./deployment-workflow";
import { Fracture, REGION_IDENTITIER } from "../core";

/*******************************************************************************
 * TEST SETUP
 ******************************************************************************/

let workflow: DeploymentWorkflow;

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
  const pipeline = app.addPipeline({
    name: "feature-branch",
    branchTriggerPattern: "feature/*",
  });
  pipeline.addStage({ name: "East Coast", environment: devUsEast });
  pipeline.addStage({ name: "West Coast", environment: devUsWest });
  workflow = new DeploymentWorkflow(pipeline, { name: "deploy-test" });
});

/*******************************************************************************
 * DEPLOY WORKFLOW
 ******************************************************************************/

describe("workflow file tests", () => {
  test("Generates expected pipeline", () => {
    const workflow = synthWorkflow("deploy-test");
    expect(workflow).toMatchSnapshot();

    console.log(workflow);
    /* const fileContent =
      workflows[`.github/workflows/${pipeline.deployName}.yml`];
    console.log(workflows[`.github/workflows/${pipeline.deployName}.yml`]);
    expect(fileContent).toBeDefined();
    expect(fileContent).toMatchSnapshot();
    */
  });
});

describe("formatting", () => {
  test("Deployments depend on build", () => {});
  test("Deployments depend on branch", () => {});
});

/**
 *
 * Helper function to generate a workflow file so we can test it's structure.
 *
 */

function synthWorkflow(name: string): any {
  const snapshot = synthSnapshot(workflow.project);
  const filtered = Object.keys(snapshot)
    .filter((path) => path.startsWith(`.github/workflows/${workflow.name}`))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: snapshot[key],
      };
    }, {});
  return filtered;
}
