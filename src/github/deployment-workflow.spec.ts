import { LogLevel } from "projen";
import { synthSnapshot } from "projen/lib/util/synth";
import { DeploymentWorkflow } from "./deployment-workflow";
import { Fracture, Pipeline } from "../core";

/*******************************************************************************
 * TEST SETUP
 ******************************************************************************/

// let fracture: Fracture;
// let app: FractureApp;
// let devUsEast: Environment;
// let devUsWest: Environment;

// beforeEach(() => {
//   /**
//    * Fracture
//    */
//   fracture = new Fracture({
//     name: "test-project",
//     logging: {
//       level: LogLevel.OFF,
//     },
//   });
//   /**
//    * Environment
//    */
//   const org = fracture.addOrganization({ id: "test-org" });
//   const account = org.addAccount({ id: "id", name: "test-account" });
//   devUsEast = fracture.addEnvironment({
//     account,
//     region: REGION_IDENTITIER.US_EAST_1,
//   });
//   devUsWest = fracture.addEnvironment({
//     account,
//     region: REGION_IDENTITIER.US_WEST_2,
//   });
//   /**
//    * Services & App
//    */
//   const companyService = fracture.addService({ name: "company" });
//   const company = companyService.addResource({ name: "company" });
//   company.addResourceAttribute({
//     name: "name",
//     shortName: "nm",
//     isRequired: true,
//   });
//   app = fracture.addApp({ name: "identity-service" });
//   app.useService(companyService);
// });

/*******************************************************************************
 * DEPLOY WORKFLOW
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
    const workflow = new DeploymentWorkflow(fracture, { pipeline });

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
    const workflow = new DeploymentWorkflow(fracture, {
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
    const workflow = new DeploymentWorkflow(fracture, {
      name: "without TurboRepo",
      pipeline,
    });

    console.log(workflow.filePath);

    const content = synthWorkflow(workflow);
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});

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
  const workflow = new DeploymentWorkflow(fracture, {
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
    const workflow = new DeploymentWorkflow(fracture, { pipeline });

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

function synthWorkflow(workflow: DeploymentWorkflow): any {
  const snapshot = synthSnapshot(workflow.project);
  const filtered = Object.keys(snapshot)
    .filter((path) => path.match(workflow.filePath))
    .reduce((obj, key) => {
      console.log(key);
      return {
        ...obj,
        [key]: snapshot[key],
      };
    }, {} as { [key: string]: any });

  //console.log(snapshot);
  return filtered[workflow.filePath];
}
