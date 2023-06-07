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
/*******************************************************************************
 * PACKAGE CONFIGURATION
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

const fooApp = fracture.addApp({ name: "foo" });
fooApp.useService(userService);

// builds all packages
fracture.build();
fracture.synth();
