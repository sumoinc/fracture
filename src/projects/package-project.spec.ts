import { PackageProject } from "./package-project";
import { synthFiles } from "../util";

describe("Success conditions", () => {
  test("Smoke Test", () => {
    const project = new PackageProject({ name: "my-project" });
    expect(project).toBeTruthy();
    //console.log(project);
  });
});

describe("Files", () => {
  test("All generated files", () => {
    const packageProject = new PackageProject({
      name: "my-project",
    });
    const content = synthFiles(packageProject);
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
});
