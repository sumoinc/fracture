import { FracturePackage, FractureProject } from "@sumoc/fracture";

const project = new FractureProject({
  name: "example-app",

  deps: ["@sumoc/fracture@../src"],

  eslintOptions: {
    dirs: ["src"],
    tsconfigPath: "./**/tsconfig.dev.json",
  },
});

project.npmignore!.exclude("packages");

const identityPackage = new FracturePackage(project, "identity");
const userService = identityPackage.addService({ name: "user" });
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

const campanyPackage = new FracturePackage(project, "company");
const companyService = campanyPackage.addService({ name: "company" });
const company = companyService.addResource({ name: "company" });
company.addResourceAttribute({
  name: "name",
  shortName: "nm",
  isRequired: true,
});

// builds all packages
project.build();
project.synth();
