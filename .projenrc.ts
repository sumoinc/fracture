import { NodePackageManager } from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";
import { VsCodeConfiguration } from "./src/projen/vscode";
import { VitePressSite } from "./src/sites/vitepress/vitepress-site";

const authorName = "Cameron Childress";
const authorAddress = "cameronc@sumoc.com";
const repository = "https://github.com/sumoinc/fracture";

const project = new TypeScriptProject({
  defaultReleaseBranch: "main",
  name: "@sumoc/fracture",
  description: "The fracture library.",
  license: "MIT",
  repository: repository,
  authorName,
  authorOrganization: true,
  copyrightOwner: authorName,
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

  // needed to make axios work with jest
  // see: https://stackoverflow.com/questions/73958968/cannot-use-import-statement-outside-a-module-with-axios
  jestOptions: {
    jestConfig: {
      moduleNameMapper: {
        axios: "axios/dist/node/axios.cjs",
      },
    },
  },
});

// prevent example from being bundled with NPM
project.npmignore!.exclude("/example-app");

// don't typecheck  templates
project.tsconfig?.exclude?.push("src/sites/vitepress/template");

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

new VitePressSite(project);

// generate
project.synth();
