import { LogLevel } from "projen";
import { synthSnapshot } from "projen/lib/util/synth";
import { DeploymentWorkflow } from "./deployment-workflow";
import { Fracture, REGION_IDENTITIER } from "../core";

/*******************************************************************************
 * TEST SETUP
 ******************************************************************************/

let workflow: DeploymentWorkflow;

beforeEach(() => {
  /**
   * Fracture
   */
  const fracture = new Fracture({
    name: "test-project",
    logging: {
      level: LogLevel.OFF,
    },
  });
  /**
   * Environment
   */
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
  /**
   * Services & App
   */
  const companyService = fracture.addService({ name: "company" });
  const company = companyService.addResource({ name: "company" });
  company.addResourceAttribute({
    name: "name",
    shortName: "nm",
    isRequired: true,
  });
  const app = fracture.addApp({ name: "identity-service" });
  app.useService(companyService);
  /**
   * Deployment pipeline
   */
  const pipeline = app.addPipeline({
    name: "feature-branch",
    branchTriggerPatterns: ["feature/*"],
  });
  pipeline.addStage({ name: "East Coast", environment: devUsEast });
  pipeline.addStage({ name: "West Coast", environment: devUsWest });
  workflow = new DeploymentWorkflow(fracture, { pipeline });
});

/*******************************************************************************
 * DEPLOY WORKFLOW
 ******************************************************************************/

describe("workflow file tests", () => {
  test("Generates expected pipeline", () => {
    const deployWorkflow = synthWorkflow();
    expect(deployWorkflow).toMatchSnapshot();

    const d = deployWorkflow[workflow.filePath];
    console.log(d);

    /* const fileContent =
      workflows[`.github/workflows/${pipeline.deployName}.yml`];
    console.log(workflows[`.github/workflows/${pipeline.deployName}.yml`]);
    expect(fileContent).toBeDefined();
    expect(fileContent).toMatchSnapshot();
    */
  });
});

/*
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

function synthWorkflow(): any {
  const snapshot = synthSnapshot(workflow.project);
  const filtered = Object.keys(snapshot)
    .filter((path) => path.startsWith(workflow.filePath))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: snapshot[key],
      };
    }, {});
  return filtered;
}
