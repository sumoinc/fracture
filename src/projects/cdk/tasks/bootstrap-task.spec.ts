import { BootstrapTask } from "./bootstrap-task";
import { AwsRegionIdentifier } from "../../../aws-organization";
import { synthFiles } from "../../../util";
import { PackageProject } from "../../package-project";
import { BootstrapConfig } from "../config/bootstrap-config";

describe("Success conditions", () => {
  test("Smoke Test", () => {
    const project = new PackageProject({
      name: "my-project",
    });

    // build task based on bootstrap config
    const task = new BootstrapTask(project, {
      config: new BootstrapConfig(project, {
        account: "123456789012",
        region: AwsRegionIdentifier.US_EAST_1,
        profileName: "foo",
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
    // build task based on bootstrap config
    new BootstrapTask(project, {
      config: new BootstrapConfig(project, {
        account: "123456789012",
        region: AwsRegionIdentifier.US_EAST_1,
        profileName: "foo",
      }),
    });

    const content = synthFiles(project);
    expect(content[".projen/tasks.json"]).toBeTruthy();
    expect(content[".projen/tasks.json"]).toMatchSnapshot();

    //console.log(JSON.stringify(content[".projen/tasks.json"], null, 2));
  });
});
