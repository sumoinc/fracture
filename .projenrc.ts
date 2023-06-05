import { NodePackageManager } from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";
import { VsCodeConfiguration } from "./src/projen/vscode";

const authorName = "Cameron Childress";
const authorAddress = "cameronc@sumoc.com";
const repository = "https://github.com/sumoinc/fracture";

const project = new TypeScriptProject({
  defaultReleaseBranch: "main",
  name: "@sumoc/fracture",
  description: "The fracture library.",
  license: "MIT",
  // repositoryUrl: repository,
  repository: repository,
  authorName,
  // author: authorName,
  authorOrganization: true,
  copyrightOwner: authorName,
  // authorAddress: authorAddress,
  authorEmail: authorAddress,
  releaseToNpm: true,
  devDeps: [],
  deps: [],
  peerDeps: [],
  projenrcTs: true,
  packageManager: NodePackageManager.PNPM,
  pnpmVersion: "8",
  prettier: true,

  // send code coverage to codecov
  codeCov: true,

  // autoapproval of auto update PRs
  autoApproveUpgrades: true,
  autoApproveOptions: { allowedUsernames: ["sumoc-automations"] },
});

// prevent example from being bundled with NPM
project.npmignore!.exclude("/example-app");

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
  "uuid"
);
project.addDevDeps("@types/uuid");
project.addPeerDeps("@aws-sdk/smithy-client", "@aws-sdk/types");

// add example app
//new ExampleApp(project);

new VsCodeConfiguration(project);

// generate
project.synth();
