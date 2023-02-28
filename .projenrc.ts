import { JsiiProject } from "projen/lib/cdk";
import { NodePackageManager } from "projen/lib/javascript";
import { ExampleApp } from "./example";
import { VsCodeConfiguration } from "./src/projen/vscode";

const authorName = "Cameron Childress";
const authorAddress = "cameronc@sumoc.com";
const repository = "https://github.com/sumoinc/fracture";

const project = new JsiiProject({
  defaultReleaseBranch: "main",
  name: "@sumoc/fracture",
  description: "The fracture library.",
  license: "MIT",
  repositoryUrl: repository,
  repository: repository,
  authorName,
  author: authorName,
  authorOrganization: true,
  copyrightOwner: authorName,
  authorAddress: authorAddress,
  authorEmail: authorAddress,
  releaseToNpm: true,
  deps: ["@types/aws-lambda", "change-case", "projen", "type-fest"],
  projenrcTs: true,
  packageManager: NodePackageManager.PNPM,
  prettier: true,

  // send code coverage to codecov
  codeCov: true,

  // autoapproval of auto update PRs
  autoApproveUpgrades: true,
  autoApproveOptions: { allowedUsernames: ["sumoc-automations"] },
});

// add example app
new ExampleApp(project);

// make example visible to typescript
project.tsconfigDev.addInclude("example/**/*.ts");
project.gitignore.include("/example/");
project.npmignore?.exclude("/example/");

new VsCodeConfiguration(project);

// generate
project.synth();
