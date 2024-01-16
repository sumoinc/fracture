import { App } from "./app";
import { AwsEnvironment } from "../environments";
import { synthFile, testApp } from "../util/test-util";

describe("success conditions", () => {
  test("Smoke test", () => {
    expect(testApp()).toBeTruthy();
  });
});

describe("validate generated project files", () => {
  test(".projen/tasks.json", () => {
    const app = testApp();
    // make sure deployment tasks get added correctly
    const usEast = new AwsEnvironment(app.parent, {
      name: "us-east",
      account: "0000000000",
    });
    // deploy both apps
    app.deploy({
      branchPrefix: "feature",
      environment: usEast,
    });

    const content = synthFile(app, ".projen/tasks.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(JSON.stringify(content, null, 2));
  });

  test("turbo.json", () => {
    const content = synthFile(testApp().parent, "turbo.json");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(JSON.stringify(content, null, 2));
  });

  test(".github/workflows/deploy.yml", () => {
    const appOne = testApp();
    const appTwo = new App({
      parent: appOne.parent,
      name: "@scope/my-other-app",
    });
    const usEast = new AwsEnvironment(appOne.parent, {
      name: "us-east",
      account: "0000000000",
    });

    // deploy both apps
    appOne.deploy({
      branchPrefix: "feature",
      environment: usEast,
    });
    appTwo.deploy({
      branchPrefix: "feature",
      environment: usEast,
    });

    const content = synthFile(appOne.parent, `.github/workflows/deploy.yml`);
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });
});
