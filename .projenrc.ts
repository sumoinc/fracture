import { NodePackageManager } from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";
import { Environment } from "./src/core/environment";
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

const site = new VitePressSite(project, {
  name: "docs",
  defaultReleaseBranch: "main",
});

// define environment for docs to deploy to
site.deployToAws(
  new Environment(project, {
    name: "us-east",
    accountNumber: "0000000000",
  })
);

// generate
project.synth();
