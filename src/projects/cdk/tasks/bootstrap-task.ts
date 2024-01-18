import { Component, Task } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import {
  findOrCreateTask,
  localOnlyTaskCondition,
} from "../../../tasks/task-utils";
import { BootstrapConfig, BootstrapFlag } from "../config/bootstrap-config";

export type BootstrapTaskOptions = {
  readonly config: BootstrapConfig;
};

export class BootstrapTask extends Component {
  public static SCRIPTNAMEBASE = "bootstrap";

  /**
   * The task
   */
  readonly task: Task;

  constructor(
    public readonly project: TypeScriptProject,
    options: BootstrapTaskOptions
  ) {
    super(project);

    /***************************************************************************
     *
     * BOOTSTRAP TASK
     *
     * Create task that can be run locally by an administrator to bootstrap one
     * specific environment.
     *
     **************************************************************************/

    const { config } = options;

    this.task = this.project.addTask(
      [
        BootstrapTask.SCRIPTNAMEBASE,
        config.account,
        config.region,
        config.flags[BootstrapFlag.QUALIFIER],
      ].join(":"),
      {
        description: `Deploy for ${config.account}:${
          config.region
        } with qualifier "${config.flags[BootstrapFlag.QUALIFIER]}"`,
        ...localOnlyTaskCondition,
      }
    );

    // add the commend to run
    this.task.exec(config.bootstrapCommand);

    /***************************************************************************
     *
     * SETUP PARENT TASKS (if needed)
     *
     * Create a master rollup task that will run all bootstrapping tasks.
     *
     **************************************************************************/

    findOrCreateTask(this.project, BootstrapTask.SCRIPTNAMEBASE, {
      description: `Bootstrap all environments.`,
    }).spawn(this.task);

    findOrCreateTask(
      this.project,
      [BootstrapTask.SCRIPTNAMEBASE, config.account].join(":"),
      {
        description: `Bootstrap environments for ${config.account}.`,
      }
    ).spawn(this.task);

    findOrCreateTask(
      this.project,
      [BootstrapTask.SCRIPTNAMEBASE, config.account, config.region].join(":"),
      {
        description: `Bootstrap environments for ${config.account}:${config.region}.`,
      }
    ).spawn(this.task);
  }
}
