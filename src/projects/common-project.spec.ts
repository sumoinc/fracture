import { CommonProject } from "./common-project";
import { synthFiles } from "../util";

describe("Success conditions", () => {
  test("Smoke Test", () => {
    const project = new CommonProject({
      name: "my-project",
    });
    expect(project).toBeTruthy();
    //console.log(project);
  });
});

describe("Files", () => {
  test("All generated files", () => {
    const project = new CommonProject({
      name: "my-project",
    });
    const content = synthFiles(project);
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });
});
