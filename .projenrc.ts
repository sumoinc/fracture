import { UpgradeDependenciesSchedule } from "projen/lib/javascript";
import { JsiiFaker } from "./src/jsii/jsii-faker";
import { PackageProject } from "./src/projects/package-project";

const authorName = "Cameron Childress";
const authorAddress = "cameronc@sumoc.com";
const repository = "https://github.com/sumoinc/fracture";

const project = new PackageProject({
  name: "@sumoc/fracture",
  description: "The fracture library.",
  repository,
  authorName,
  authorOrganization: true,
  authorEmail: authorAddress,
  releaseToNpm: true,

  // use the default Apache 2 license
  licensed: true,

  // autoapproval of auto update PRs
  autoApproveUpgrades: true,
  autoApproveOptions: {
    /**
     * Allow both manual and automated triggers to be auto-approved.
     */
    allowedUsernames: ["github-actions[bot]", "cameroncf"],
    label: "auto-approve",
  },

  depsUpgradeOptions: {
    workflowOptions: {
      schedule: UpgradeDependenciesSchedule.expressions(["0 6 * * *"]),
    },
  },

  // deps
  deps: ["constructs", "projen", "change-case", "type-fest"],
});

// prevent docs and tests from being bundled with NPM
project.addPackageIgnore("/sites");

// Build our own fake JSII file
const jsiiFaker = new JsiiFaker(project);
jsiiFaker.addClass({
  classPath: "@sumoc/fracture.CommonProject",
  basePath: "projen.typescript.TypeScriptProject",
});

/*
const foo = inventory
  .discover(__dirname)
  .filter((x) => x.moduleName === "@sumoc/fracture");
console.log(JSON.stringify(foo, null, 2));
*/

// generate
project.synth();
