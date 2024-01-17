import { Component, Task } from "projen";
import { CdkProject } from "../../cdk";
import { localOnlyOptions } from "../../tasks/options";

export class CheckupTask extends Component {
  public static SCRIPTNAME = "checkup";

  /**
   * The task
   */
  readonly task: Task;

  constructor(public readonly project: CdkProject) {
    super(project);

    this.task = project.addTask(CheckupTask.SCRIPTNAME, {
      description: `Runs everythiung but sso-login to make sure all environments are healthy and bootstrapped properly.`,
      ...localOnlyOptions,
    });
  }
}
