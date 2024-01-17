import { Component, Task } from "projen";
import { CdkProject } from "../../cdk";
import { localOnlyOptions } from "../../tasks/options";
import { findOrCreateTask } from "../../tasks/util";

export type SsoLoginTaskOptions = {
  /**
   * The profile to create tasks for.
   */
  readonly profileName: string;
};

export class SsoLoginTask extends Component {
  public static SCRIPTNAMEBASE = "sso:login";

  public static all(project: CdkProject): Array<SsoLoginTask> {
    const isDefined = (c: Component): c is SsoLoginTask =>
      c instanceof SsoLoginTask;
    return project.components.filter(isDefined);
  }

  /**
   * Create if needed or return it if not.
   */
  public static ensureExists(
    project: CdkProject,
    options: SsoLoginTaskOptions
  ): SsoLoginTask {
    /**
     * Find function
     */
    const isDefined = (c: Component): c is SsoLoginTask =>
      c instanceof SsoLoginTask && c.profileName === options.profileName;

    return (
      project.components.find(isDefined) ??
      new SsoLoginTask(project, { ...options })
    );
  }

  public readonly profileName: string;

  /**
   * The task
   */
  readonly task: Task;

  constructor(project: CdkProject, options: SsoLoginTaskOptions) {
    super(project);

    /***************************************************************************
     * DEFAULT OPTIONS
     **************************************************************************/

    this.profileName = options.profileName;

    /***************************************************************************
     * PROFILE TASK
     **************************************************************************/

    this.task = project.addTask(
      [SsoLoginTask.SCRIPTNAMEBASE, options.profileName].join(":"),
      {
        description: `SSO Login for ${options.profileName}`,
        ...localOnlyOptions,
        exec: `aws sso login --profile "${options.profileName}"`,
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
