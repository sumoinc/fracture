import { SsoLoginTask } from "./sso-login-task";
import {
  AwsOrganization,
  AwsProfile,
  AwsProfileType,
  AwsRegionIdentifier,
} from "../../../aws-organization";
import { synthFiles } from "../../../util";
import { CommonProject } from "../../common-project";

describe("Success conditions", () => {
  test("Smoke Test", () => {
    const project = new CommonProject({
      name: "my-project",
    });

    // add org
    const org = new AwsOrganization(project, {
      orgId: "o-abc-123",
      ssoStartUrl: "https://example.com",
      ssoAccount: "123456789012",
    });

    // build task based on profile
    const task = new SsoLoginTask(project, {
      profile: new AwsProfile(project, {
        org,
        account: "123456789012",
        region: AwsRegionIdentifier.US_EAST_1,
        profileType: AwsProfileType.SSO_LOGIN,
      }),
    });

    expect(task).toBeTruthy();
  });
});

describe("Files", () => {
  test(".projen/tasks.json", () => {
    const project = new CommonProject({
      name: "my-project",
    });

    // add org
    const org = new AwsOrganization(project, {
      orgId: "o-abc-123",
      ssoStartUrl: "https://example.com",
      ssoAccount: "123456789012",
    });

    // build task based on profile
    new SsoLoginTask(project, {
      profile: new AwsProfile(project, {
        org,
        account: "123456789012",
        region: AwsRegionIdentifier.US_EAST_1,
        profileType: AwsProfileType.SSO_LOGIN,
      }),
    });

    const content = synthFiles(project);
    expect(content[".projen/tasks.json"]).toBeTruthy();
    expect(content[".projen/tasks.json"]).toMatchSnapshot();

    // console.log(JSON.stringify(content[".projen/tasks.json"], null, 2));
  });
});
