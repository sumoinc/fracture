import { JsiiProject } from 'projen/lib/cdk';
import { NodePackageManager } from 'projen/lib/javascript';
import { ExampleApp } from './example';
import { VsCodeConfiguration } from './src/projen/vscode';

const authorName = 'Cameron Childress';
const authorAddress = 'cameronc@sumoc.com';
const repository = 'https://github.com/sumoinc/fracture';

const project = new JsiiProject({
  defaultReleaseBranch: 'main',
  name: '@sumoc/fracture',
  description: 'The fracture library.',
  license: 'MIT',
  repositoryUrl: repository,
  repository: repository,
  authorName,
  author: authorName,
  authorOrganization: true,
  copyrightOwner: authorName,
  authorAddress: authorAddress,
  authorEmail: authorAddress,
  releaseToNpm: true,
  deps: ['projen', 'change-case', 'type-fest'],
  projenrcTs: true,
  packageManager: NodePackageManager.PNPM,
});

// add example app
new ExampleApp(project);

// make example visible to typescript
project.tsconfigDev.addInclude('example/**/*.ts');
project.gitignore.include('/example/');
project.npmignore?.exclude('/example/');

new VsCodeConfiguration(project);

project.synth();