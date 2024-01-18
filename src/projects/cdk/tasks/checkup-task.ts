import { Component, Task } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { BootstrapTask } from "./bootstrap-task";
import { ProfileTask } from "./profile-task";
import { findOrCreateTask, localOnlyTaskCondition } from "../../../tasks/task-utils";

export class CheckupTask extends Component {
  public static SCRIPTNAME = "checkup";

  /**
   * The task
   */
  readonly task: Task;

  constructor(public readonly project: TypeScriptProject) {
    super(project);

    this.task = project.addTask(CheckupTask.SCRIPTNAME, {
      description: `Runs everythiung but sso-login to make sure all environments are healthy and bootstrapped properly.`,
      ...localOnlyTaskCondition,
    });

    // this.task.exec(`rm -rf ${this.deploymentArtifactRoot}`);

    // make sure all profiles are created locally
    this.task.spawn(findOrCreateTask(this.project, ProfileTask.SCRIPTNAMEBASE));

    // make sure all environments are properly bootstrapped
    this.task.spawn(
      findOrCreateTask(this.project, BootstrapTask.SCRIPTNAMEBASE)
    );
  }
}
