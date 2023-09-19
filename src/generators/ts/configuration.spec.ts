import { Configuration } from "./configuration";
import { AwsEnvironment } from "../../environments";
import { DataService, Resource } from "../../services";
import { synthFile, testApp, testDataService } from "../../util/test-util";

describe("Success Conditions", () => {
  test("Service Configuration", () => {
    const service = testDataService();
    new Resource(service, {
      name: "user",
      attributeOptions: [
        {
          name: "name",
        },
      ],
    });

    new Resource(service, {
      name: "widget",
      tenantEnabled: true,
      attributeOptions: [
        {
          name: "name",
        },
      ],
    });

    new Configuration(service);

    const content = synthFile(service, "src/configuration.ts");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    // console.log(content);
  });

  test("App Configuration", () => {
    const app = testApp();
    app.addService(new DataService({ parent: app.parent, name: "my-service" }));

    // environments
    const devEast = new AwsEnvironment(app, {
      name: "dev-east",
      account: "000000000000",
      region: "us-east-1",
    });
    const prodEast = new AwsEnvironment(app, {
      name: "prod-east",
      account: "111111111111",
      region: "us-east-1",
    });

    // simulate deploy to these environnments
    app.deploy({
      branchPrefix: "feature/*",
      environment: devEast,
    });
    app.deploy({
      branchPrefix: "main",
      environment: prodEast,
    });

    new Configuration(app);

    const content = synthFile(app, "src/configuration.ts");
    expect(content).toBeTruthy();
    expect(content).toMatchSnapshot();
    //console.log(content);
  });
});
