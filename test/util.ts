import { Project, ProjectOptions, Task } from "projen";
import { Fracture, FractureOptions } from "../src";

export class TestFracture extends Fracture {
  constructor(options: FractureOptions = {}) {
    super(new TestProject(), "my-fracture", {
      ...options,
    });
  }
}

export class TestProject extends Project {
  constructor(options: Omit<ProjectOptions, "name"> = {}) {
    super({
      name: "test-project",
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
