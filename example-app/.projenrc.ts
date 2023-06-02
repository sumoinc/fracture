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
identityPackage.addService({ name: "user" });

project.synth();
