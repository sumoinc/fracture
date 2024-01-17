import { BootstrapConfig } from "./bootstrap-config";
import { AwsRegionIdentifier } from "../../../aws-organization";
import { PackageProject } from "../../package-project";

describe("Success conditions", () => {
  test("Smoke Test", () => {
    const project = new PackageProject({
      name: "my-project",
    });
    expect(project).toBeTruthy();

    // bootstrap an environment
    const config = new BootstrapConfig(project, {
      account: "123456789012",
      region: AwsRegionIdentifier.US_EAST_1,
      profileName: "foo",
    });

    expect(config).toBeTruthy();
  });
});

describe("Command output", () => {
  test("With CDK Version", () => {
    const project = new PackageProject({
      name: "my-project",
    });
    expect(project).toBeTruthy();

    // bootstrap an environment
    const config = new BootstrapConfig(project, {
      account: "123456789012",
      region: AwsRegionIdentifier.US_EAST_1,
      profileName: "foo",
      cdkVersion: "2.210.0",
    });

    expect(config.bootstrapCommand).toBeTruthy();
    expect(config.bootstrapCommand).toMatchSnapshot();

    // console.log(config.bootstrapCommand);
  });

  test("Without CDK Version", () => {
    const project = new PackageProject({
      name: "my-project",
    });
    expect(project).toBeTruthy();

    // bootstrap an environment
    const config = new BootstrapConfig(project, {
      account: "123456789012",
      region: AwsRegionIdentifier.US_EAST_1,
      profileName: "foo",
    });

    expect(config.bootstrapCommand).toBeTruthy();
    expect(config.bootstrapCommand).toMatchSnapshot();

    // console.log(config.bootstrapCommand);
  });
});
