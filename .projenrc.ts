import { UpgradeDependenciesSchedule } from "projen/lib/javascript";
import { PackageProject } from "./src/projects/package-project";
import { VsCodeConfig } from "./src/vscode";

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
  devDeps: [],
  deps: [],
  peerDeps: [],
  projenrcTs: true,

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
});

// prevent docs and tests from being bundled with NPM
project.addPackageIgnore("/sites");

// make sure inline tests work
// project.jest!.addTestMatch("<rootDir>/(test|src)/**/*.(spec|test).ts?(x)");

// dependancies fracture needs
project.addDeps("change-case", "projen", "type-fest");

/*******************************************************************************
 *
 * Dogfooding for local development and documantation site.
 *
 ******************************************************************************/

// configure vs code
new VsCodeConfig(project);

// // build out documentation site
// const site = new VitePressSite({
//   parent: project,
//   name: "docs",
// });

/*******************************************************************************
 * NETLIFY DEPLOYMENT TARGET
 ******************************************************************************/
// const netlifyTarget = new NetlifyEnvironment(project, {
//   name: "netlify",
//   siteId: "e69db060-d613-414c-9964-4a5a5e0e32ea",
// });

// // deployment target for docs
// site.deploy({
//   branchPrefix: "main",
//   environment: netlifyTarget,
// });

/*******************************************************************************
 * AWS SERVICE
 ******************************************************************************/

/*
const service = new DataService({
  parent: project,
  name: "my-service",
  resourceOptions: [
    {
      name: "widget",
      attributeOptions: [
        {
          name: "name",
          shortName: "n",
        },
      ],
    },
  ],
});
*/
// kitchen sink test / demo
// new KitchenSink(service);

/*
const awsTarget = new AwsEnvironment(project, {
  name: "hosting",
  accountNumber: "726654216209",
});
*/

// generate
project.synth();
