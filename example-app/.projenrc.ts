import { FracturePackage, FractureProject } from "@sumoc/fracture";

const project = new FractureProject({
  name: "example-app",
  github: false,

  deps: ["@sumoc/fracture@../src"],

  eslintOptions: {
    dirs: ["src"],
    tsconfigPath: "./**/tsconfig.dev.json",
  },
});

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

// builds all packages
project.build();
project.synth();
