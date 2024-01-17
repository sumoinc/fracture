import { CdkProject } from "./cdk-project";
import {
  AwsOrganization,
  AwsProfile,
  AwsProfileType,
  AwsRegionIdentifier,
} from "../../aws-organization";

describe("Success conditions", () => {
  test("Smoke Test", () => {
    const project = new CdkProject({
      name: "my-project",
      repository: "https://github.com/sumoinc/my-repo",
    });
    expect(project).toBeTruthy();
    //console.log(project);

    // add org
    const org = new AwsOrganization(project, {
      orgId: "o-abc-123",
      ssoStartUrl: "https://example.com",
      ssoAccount: "123456789012",
    });

    // add local profile
    // causes profile to be written to disk
    new AwsProfile(project, {
      org,
      account: "123456789012",
      region: AwsRegionIdentifier.US_EAST_1,
      profileType: AwsProfileType.BOOTSTRAP,
    });

    // bootstrap an environment
    // BOOTSTRAP PROJECT
    /*
    const bootstrapConfig = project.bootstrap({
      account: "123456789012",
      region: "us-east-1",
      profile: profile, // automatically adds profile?
    });
    */

    // add deployment profile
    // CDK PROJECT
    /*
    project.addProfile({
      orgId: "123456789012",
      account: "123456789012",
      region: "us-east-1",
      profileType: "deploy",
    });
    */

    // ability to deploy prod to environment
    // - creates deploy task
    // -
    // CDK PROJECT
    /*
    const deployCapability = project.deployCapability({
      repo: "foo",
      branchType: prod,
      account: "123456789012",
      region: "us-east-1",
      bootstrapQualifier: "foo",
      profileName: profile.name,
    });
    */

    // BOOTSTRAP PROJECT
    // GitHubRoleConfig({ deployCapability });

    // FINAL
    // write githuboicd role config to src/config
    // maybe write all configs there?
    // should this become a big shared config location for the project?
    // during project.synth();
  });
});

/*
describe("Files", () => {
  test("All generated files", () => {
    const project = new CdkProject({
      name: "my-project",
    });
    const content = synthFiles(project);
    expect(content).toBeTruthy();
    // expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
});
*/
