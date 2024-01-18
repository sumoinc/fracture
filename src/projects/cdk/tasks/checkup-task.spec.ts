import { CheckupTask } from "./checkup-task";
import { synthFiles } from "../../../util";
import { PackageProject } from "../../package-project";

describe("Success conditions", () => {
  test("Smoke Test", () => {
    const project = new PackageProject({
      name: "my-project",
    });

    // build task based on bootstrap config
    const task = new CheckupTask(project);

    expect(task).toBeTruthy();
  });
});

describe("Files", () => {
  test(".projen/tasks.json", () => {
    const project = new PackageProject({
      name: "my-project",
    });

    // build task
    new CheckupTask(project);

    const content = synthFiles(project);
    expect(content[".projen/tasks.json"]).toBeTruthy();
    expect(content[".projen/tasks.json"]).toMatchSnapshot();

    // console.log(JSON.stringify(content[".projen/tasks.json"], null, 2));
  });
});
