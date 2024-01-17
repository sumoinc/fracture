import { Component, Task } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { AwsProfile } from "../../../aws-organization";
import { findOrCreateTask, localOnlyTaskCondition } from "../../../tasks/utils";

export type ProfileTaskOptions = {
  readonly profile: AwsProfile;
};

export class ProfileTask extends Component {
  public static SCRIPTNAMEBASE = "profiles";

  /**
   * The task
   */
  readonly task: Task;

  constructor(
    public readonly project: TypeScriptProject,
    options: ProfileTaskOptions
  ) {
    super(project);

    const { profile } = options;

    /***************************************************************************
     * PROFILE TASK
     **************************************************************************/

    this.task = project.addTask(
      [ProfileTask.SCRIPTNAMEBASE, profile.profileName].join(":"),
      {
        description: `Write profile for ${profile.profileName}`,
        ...localOnlyTaskCondition,
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
