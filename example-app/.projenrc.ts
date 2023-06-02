import { FractureProject } from "@sumoc/fracture";
//import { typescript } from "projen";

const project = new FractureProject({
  defaultReleaseBranch: "main",
  name: "example-app",
  projenrcTs: true,
  github: false,

  devDeps: [],
  deps: ["@sumoc/fracture@../src"],
  peerDeps: [],

  eslintOptions: {
    dirs: ["src"],
    tsconfigPath: "./example-app/tsconfig.dev.json",
  },
});
project.synth();
