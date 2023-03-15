import { Task } from "projen";
import {
  TypeScriptProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { Fracture, FractureOptions } from "../src";

export class TestFracture extends Fracture {
  constructor(options: FractureOptions = {}) {
    super(new TestProject({ logging: options.logging }), "my-fracture", {
      ...options,
    });
  }
}

export class TestProject extends TypeScriptProject {
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
