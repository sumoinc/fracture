import { Fracture } from "@sumoc/fracture";

const fracture = new Fracture({
  name: "example-app",

  // delow are non standard - used for this example to make it work right.
  deps: ["@sumoc/fracture@../src"],
  eslintOptions: {
    dirs: ["src"],
    tsconfigPath: "./**/tsconfig.dev.json",
  },
});

fracture.npmignore!.exclude("packages");

/*******************************************************************************
 * ORGANIZATION CONFIGURATION
 ******************************************************************************/

const org = fracture.addOrganization({ id: "org-123456" });
const devAccount = org.addAccount({ id: "0000000000", name: "dev" });
//const stagingAccount = org.addAccount({ id: "1111111111", name: "stage" });
//const prodAccount = org.addAccount({ id: "2222222222", name: "prod" });

const devUsEa01 = fracture.addEnvironment({
  account: devAccount,
  region: "us-east-1",
});

/*******************************************************************************
 * SERVICE CONFIGURATION
 ******************************************************************************/

const userService = fracture.addService({ name: "user" });
const user = userService.addResource({ name: "user" });
user.addResourceAttribute({
  name: "first-name",
  shortName: "fn",
  isRequired: true,
});
user.addResourceAttribute({
  name: "last-name",
  shortName: "ln",
  isRequired: true,
});

/**
 * Dev Deployment:
 * - branchTriggerPattern: 'feature/*'
 * - environments: [east, west]
 * then to environments: [west]
 */

const companyService = fracture.addService({ name: "company" });
const company = companyService.addResource({ name: "company" });
company.addResourceAttribute({
  name: "name",
  shortName: "nm",
  isRequired: true,
});

/*******************************************************************************
 * APPLICATION CONFIGURATION
 ******************************************************************************/

const identityApp = fracture.addApp({ name: "identity-service" });
identityApp.useService(userService);
identityApp.addDeployment({ environment: devUsEa01 });

// deploy feature branch to dev account, us-east-1
// Deployment, Wave, and Phase are all optional
// builds all packages
fracture.build();
fracture.synth();
