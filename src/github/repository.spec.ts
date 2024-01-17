import { Repository } from "./repository";
import { PackageProject } from "../projects";

describe("Success conditions", () => {
  test("Smoke Test", () => {
    const project = new PackageProject({
      name: "my-project",
      repository: "https://github.com/foo-org/bar-repo",
    });
    const repo = Repository.of(project);

    expect(repo).toBeTruthy();
    expect(repo).toBeDefined();
    expect(repo?.url).toEqual("https://github.com/foo-org/bar-repo");
    expect(repo?.org).toEqual("foo-org");
    expect(repo?.name).toEqual("bar-repo");
    expect(repo?.branchFull).toBeTruthy();
    expect(repo?.branchName).toBeTruthy();

    // console.log(repo?.branchFull);
  });
});
