import { AwsOrganization } from "./aws-organization";
import { AwsRegionIdentifier } from "./aws-region";
import { CommonProject } from "../projects/common-project";
import { synthFiles } from "../util";

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
    expect(org).toBeTruthy();
  });
});

describe("Files", () => {
  test("All generated files", () => {
    const project = new CommonProject({
      name: "my-project",
    });
    const content = synthFiles(project);
    expect(content).toBeTruthy();
    // expect(content).toMatchSnapshot();
    //console.log(JSON.stringify(content, null, 2));
  });

  test("Bootstrapping Environments", () => {
    // base project
    const project = new CommonProject({
      name: "my-project",
    });

    // add org
    const org = new AwsOrganization(project, {
      orgId: "o-abc-123",
      ssoStartUrl: "https://example.com",
      ssoAccount: "123456789012",
    });

    // bootstraps for org
    org.bootstrap({
      account: "000000000000",
      region: AwsRegionIdentifier.US_EAST_1,
    });

    const content = synthFiles(project);
    expect(content).toBeTruthy();
    expect(content[".projen/tasks.json"]).toMatchSnapshot();
    // console.log(JSON.stringify(content[".projen/tasks.json"], null, 2));
  });

  test("With Deploy Profiles", () => {
    // base project
    const project = new CommonProject({
      name: "my-project",
    });

    // add org
    const org = new AwsOrganization(project, {
      orgId: "o-abc-123",
      ssoStartUrl: "https://example.com",
      ssoAccount: "123456789012",
    });

    // bootstraps for org
    org.addDeploymentProfile({
      account: "000000000000",
      region: AwsRegionIdentifier.US_EAST_1,
    });

    const content = synthFiles(project);
    expect(content).toBeTruthy();
    expect(content[".projen/tasks.json"]).toMatchSnapshot();

    // console.log(JSON.stringify(content[".projen/tasks.json"], null, 2));
  });

  test("With Login Profile", () => {
    // base project
    const project = new CommonProject({
      name: "my-project",
    });

    // add org
    const org = new AwsOrganization(project, {
      orgId: "o-abc-123",
      ssoStartUrl: "https://example.com",
      ssoAccount: "123456789012",
    });

    // bootstraps for org
    org.addSsoLogin({
      account: "000000000000",
      region: AwsRegionIdentifier.US_EAST_1,
    });

    const content = synthFiles(project);
    expect(content).toBeTruthy();
    expect(content[".projen/tasks.json"]).toMatchSnapshot();

    //console.log(JSON.stringify(content[".projen/tasks.json"], null, 2));
  });
});
