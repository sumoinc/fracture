import { ProfileTask } from "./profile-task";
import {
  AwsOrganization,
  AwsProfile,
  AwsProfileType,
  AwsRegionIdentifier,
} from "../../../aws-organization";
import { synthFiles } from "../../../util";
import { PackageProject } from "../../package-project";

describe("Success conditions", () => {
  test("Smoke Test", () => {
    const project = new PackageProject({
      name: "my-project",
    });

    // add org
    const org = new AwsOrganization(project, {
      orgId: "o-abc-123",
      ssoStartUrl: "https://example.com",
      ssoAccount: "123456789012",
    });

    // build task based on bootstrap config
    const task = new ProfileTask(project, {
      profile: new AwsProfile(project, {
        org,
        account: "123456789012",
        region: AwsRegionIdentifier.US_EAST_1,
        profileType: AwsProfileType.DEPLOYMENT,
      }),
    });

    expect(task).toBeTruthy();
  });
});

describe("Files", () => {
  test(".projen/tasks.json", () => {
    const project = new PackageProject({
      name: "my-project",
    });

    // add org
    const org = new AwsOrganization(project, {
      orgId: "o-abc-123",
      ssoStartUrl: "https://example.com",
      ssoAccount: "123456789012",
    });

    // build task based on bootstrap config
    new ProfileTask(project, {
      profile: new AwsProfile(project, {
        org,
        account: "123456789012",
        region: AwsRegionIdentifier.US_EAST_1,
        profileType: AwsProfileType.DEPLOYMENT,
      }),
    });

    const content = synthFiles(project);
    expect(content[".projen/tasks.json"]).toBeTruthy();
    expect(content[".projen/tasks.json"]).toMatchSnapshot();

    // console.log(JSON.stringify(content[".projen/tasks.json"], null, 2));
  });
});
