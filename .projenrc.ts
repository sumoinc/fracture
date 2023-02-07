import { JsiiProject } from 'projen/lib/cdk';
import { NodePackageManager } from 'projen/lib/javascript';
import { VsCodeConfiguration } from './src/config/vscode';

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
  deps: ['projen'],
  projenrcTs: true,
  packageManager: NodePackageManager.PNPM,
});

new VsCodeConfiguration(project);

project.synth();