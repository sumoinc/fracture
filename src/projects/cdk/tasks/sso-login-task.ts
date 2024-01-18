import { Component, Task } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { AwsProfile } from "../../../aws-organization";
import {
  findOrCreateTask,
  localOnlyTaskCondition,
} from "../../../tasks/task-utils";

export type SsoLoginTaskOptions = {
  /**
   * The profile we'll use to log into SSO.
   */
  readonly profile: AwsProfile;
};

export class SsoLoginTask extends Component {
  public static SCRIPTNAMEBASE = "sso:login";

  public static all(project: TypeScriptProject): Array<SsoLoginTask> {
    const isDefined = (c: Component): c is SsoLoginTask =>
      c instanceof SsoLoginTask;
    return project.components.filter(isDefined);
  }

  /**
   * The task
   */
  readonly task: Task;

  constructor(project: TypeScriptProject, options: SsoLoginTaskOptions) {
    super(project);

    const { profile } = options;

    /***************************************************************************
     * PROFILE TASK
     **************************************************************************/

    this.task = project.addTask(
      [SsoLoginTask.SCRIPTNAMEBASE, profile.profileName].join(":"),
      {
        description: `SSO Login for ${profile.profileName}`,
        ...localOnlyTaskCondition,
        exec: `aws sso login --profile "${profile.profileName}"`,
      }
    );

    /***************************************************************************
     * SETUP PARENT TASKS (if needed)
     **************************************************************************/

    findOrCreateTask(project, SsoLoginTask.SCRIPTNAMEBASE, {
      description: `log into all profiles.`,
    }).spawn(this.task);
  }
}
