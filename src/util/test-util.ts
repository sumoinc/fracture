import { synthSnapshot } from "projen/lib/util/synth";
import { Fracture } from "../";

export const TEST_ACCOUNT_ONE = "000000000000";
export const TEST_ORG_ONE = "org-123456";
export const TEST_REGION_ONE = "us-east-1";

/**
 *
 * Helper to generate and return one file from fracture.
 * Useful when trying to test the final output of generated files.
 *
 * @param fracture
 * @param filepath
 * @returns collection of files starting with supplied filepath
 */
export const synthFiles = (fracture: Fracture, filepath: string): any => {
  const snapshot = synthSnapshot(fracture);
  const filtered = Object.keys(snapshot)
    .filter((path) => path.startsWith(filepath))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: snapshot[key],
      };
    }, {} as { [key: string]: any });
  return filtered;
};

export const synthFile = (fracture: Fracture, filepath: string): string => {
  const files = synthFiles(fracture, filepath);

  if (files.length > 1) {
    throw new Error(`more than one file matched filepath "${filepath}"`);
  }

  if (files.length === 0) {
    throw new Error(`No files matched filepath "${filepath}"`);
  }

  return files[filepath];
};

/*
export class TestFracture extends Fracture {
  constructor(
    options: Omit<
      TypeScriptProjectOptions,
      "name" | "defaultReleaseBranch"
    > = {}
  ) {
    super({
      name: "test-project",
      defaultReleaseBranch: "main",
      logging: {
        level: LogLevel.OFF,
      },
      ...options,
    });
  }

  testOrg = () => {
    return this.organizations.length > 0
      ? this.organizations[0]
      : this.addOrganization({ id: TEST_ORG_ONE });
  };

  testEnvironment = () => {
    return this.environments.length > 0
      ? this.environments[0]
      : this.addEnvironment({
          account: this.testAccount(),
          region: TEST_REGION_ONE,
        });
  };

  testAccount = () => {
    return this.testOrg().accounts.length > 0
      ? this.testOrg().accounts[0]
      : this.testOrg().addAccount({ id: TEST_ACCOUNT_ONE, name: "dev" });
  };

  testApp = () => {
    return this.apps.length > 0
      ? this.apps[0]
      : this.addApp({ name: "test-app" });
  };

  testPipeline = () => {
    return this.testApp().pipelines.length > 0
      ? this.testApp().pipelines[0]
      : this.testApp().addPipeline({
          name: "test-pipeline",
          branchTriggerPattern: "test-path/*",
        });
  };

  testWave = () => {
    return this.testPipeline().waves.length > 0
      ? this.testPipeline().waves[0]
      : this.testPipeline().addWave({
          name: "test-wave",
        });
  };

  testStage = () => {
    return this.testWave().stages.length > 0
      ? this.testWave().stages[0]
      : this.testWave().addStage({
          name: "test-stage",
          environment: this.testEnvironment(),
        });
  };

  // override runTaskCommand in tests since the default includes the version
  // number and that will break regresion tests.
  public runTaskCommand(task: Task) {
    return `projen ${task.name}`;
  }


  postSynthesize() {
    fs.writeFileSync(path.join(this.outdir, ".postsynth"), "# postsynth");
  }

}
*/
