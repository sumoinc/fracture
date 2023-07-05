import { Task } from "projen";
import { TypeScriptProjectOptions } from "projen/lib/typescript";
import { Fracture } from "../src";

export const TEST_ACCOUNT_ONE = "000000000000";
export const TEST_ORG_ONE = "org-123456";

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
          region: "us-east-1",
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

  /*
  postSynthesize() {
    fs.writeFileSync(path.join(this.outdir, ".postsynth"), "# postsynth");
  }
  */
}
