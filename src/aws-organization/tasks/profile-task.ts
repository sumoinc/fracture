import { Component, Task } from "projen";
import { CdkProject } from "../../cdk";
import { localOnlyOptions } from "../../tasks/options";
import { findOrCreateTask } from "../../tasks/util";
import { AwsProfile } from "../aws-profile";

export type ProfileTaskOptions = {
  /**
   * The profile to create tasks for.
   */
  readonly profile: AwsProfile;
};

export class ProfileTask extends Component {
  public static SCRIPTNAMEBASE = "profile";

  public static ensureExists(
    project: CdkProject,
    options: ProfileTaskOptions
  ): ProfileTask {
    /**
     * Find function
     */
    const isDefined = (c: Component): c is ProfileTask =>
      c instanceof ProfileTask && c.profileName === options.profile.profileName;

    return (
      project.components.find(isDefined) ?? new ProfileTask(project, options)
    );
  }

  public readonly profileName: string;

  /**
   * The task
   */
  readonly task: Task;

  constructor(project: CdkProject, options: ProfileTaskOptions) {
    super(project);

    /***************************************************************************
     * DEFAULT OPTIONS
     **************************************************************************/

    const { profile } = options;
    this.profileName = profile.profileName;

    /***************************************************************************
     * PROFILE TASK
     **************************************************************************/

    this.task = project.addTask(
      [ProfileTask.SCRIPTNAMEBASE, profile.profileName].join(":"),
      {
        description: `Write profile for ${profile.profileName}`,
        ...localOnlyOptions,
        exec: [
          `aws configure set sso_start_url ${profile.ssoStartUrl} --profile ${profile.profileName}`,
          `aws configure set sso_region ${profile.ssoRegion} --profile ${profile.profileName}`,
          `aws configure set sso_account_id ${profile.account} --profile ${profile.profileName}`,
          `aws configure set sso_role_name ${profile.ssoRoleName} --profile ${profile.profileName}`,
          `aws configure set region ${profile.region} --profile ${profile.profileName}`,
        ].join(" && "),
      }
    );

    /***************************************************************************
     * SETUP PARENT TASKS (if needed)
     **************************************************************************/

    findOrCreateTask(project, ProfileTask.SCRIPTNAMEBASE, {
      description: `Write all profiles.`,
    }).spawn(this.task);
  }
}
