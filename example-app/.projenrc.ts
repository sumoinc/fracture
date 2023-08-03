import { Fracture } from "@sumoc/fracture";
import { REGION_IDENTITIER } from "@sumoc/fracture/core/region";

const fracture = new Fracture({
  name: "example-app",

  // below are non standard - used for this example to make it work right.
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

const devUsEast = fracture.addEnvironment({
  account: devAccount,
  region: REGION_IDENTITIER.US_EAST_1,
});

const devUsWest = fracture.addEnvironment({
  account: devAccount,
  region: REGION_IDENTITIER.US_WEST_2,
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

/*******************************************************************************
 * DEPLOYMENT CONFIGURATION
 ******************************************************************************/

const featurePipeline = identityApp.addPipeline({
  name: "feature-branch",
  branchTriggerPattern: "feature/*",
});
featurePipeline.addStage({ name: "East Coast", environment: devUsEast });
featurePipeline.addStage({ name: "West Coast", environment: devUsWest });

/*******************************************************************************
 * BUILD / SYNTH
 ******************************************************************************/

//fracture.build();
fracture.synth();
