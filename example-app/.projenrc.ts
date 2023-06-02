import { typescript } from "projen";
import { NodePackageManager } from "projen/lib/javascript";

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: "main",
  name: "example-app",
  projenrcTs: true,
  github: false,

  devDeps: [],
  deps: [],
  peerDeps: [],
  packageManager: NodePackageManager.PNPM,
  pnpmVersion: "8",
  prettier: true,

  /*
  eslintOptions: {
    tsconfigPath: "./tsconfig.json",
  },
  */

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
