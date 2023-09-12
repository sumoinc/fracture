import {
  NodePackageManager,
  UpgradeDependenciesSchedule,
} from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";
import { NetlifyEnvironment } from "./src/environments/netlify-environment";
import { VsCodeConfiguration } from "./src/projen/vscode";
import { VitePressSite } from "./src/sites/vitepress/vitepress-site";

const authorName = "Cameron Childress";
const authorAddress = "cameronc@sumoc.com";
const repository = "https://github.com/sumoinc/fracture";

const project = new TypeScriptProject({
  defaultReleaseBranch: "main",
  name: "@sumoc/fracture",
  description: "The fracture library.",
  repository: repository,
  authorName,
  authorOrganization: true,
  // copyrightOwner: authorName,
  authorEmail: authorAddress,
  releaseToNpm: true,
  devDeps: [],
  deps: [],
  peerDeps: [],
  projenrcTs: true,

  // use node 18
  workflowNodeVersion: "18",

  // use prettier for linting
  prettier: true,

  // pnpm configs
  packageManager: NodePackageManager.PNPM,
  pnpmVersion: "8",

  // send code coverage to codecov
  codeCov: true,

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
project.addPackageIgnore("/apps");
project.addPackageIgnore("node_modules");
project.addPackageIgnore("/**/*.spec.*");
project.addPackageIgnore(".gitattributes");
project.addPackageIgnore(".prettierignore");
project.addPackageIgnore(".prettierrc.json");
project.addPackageIgnore(".projenrc.ts");

// make sure inline tests work
project.jest!.addTestMatch("<rootDir>/(test|src)/**/*.(spec|test).ts?(x)");

// dependancies fracture needs
project.addDeps(
  "@aws-sdk/client-dynamodb",
  "@aws-sdk/lib-dynamodb",
  "@aws-sdk/util-dynamodb",
  "@faker-js/faker",
  "@types/aws-lambda",
  "change-case",
  "projen",
  "type-fest",
  "typescript",
  "uuid"
);
project.addDevDeps("@types/uuid");
project.addPeerDeps("@aws-sdk/smithy-client", "@aws-sdk/types");

/*******************************************************************************
 *
 * Dogfooding for local development and documantation site.
 *
 ******************************************************************************/

// configure vs code
new VsCodeConfiguration(project);

// build out documentation site
const site = new VitePressSite({
  parent: project,
  name: "docs",
});

/*******************************************************************************
 * NETLIFY DEPLOYMENT TARGET
 ******************************************************************************/
const netlifyTarget = new NetlifyEnvironment(project, {
  name: "netlify",
  siteId: "e69db060-d613-414c-9964-4a5a5e0e32ea",
});

// deployment target for docs
site.deploy({
  branchPrefix: "main",
  environment: netlifyTarget,
});

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
