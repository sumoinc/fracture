import { Component, Project } from 'projen';
import { VsCode, VsCodeRecommendedExtensions, VsCodeSettings } from 'projen/lib/vscode';

export class VsCodeConfiguration extends Component {
  constructor(project: Project) {
    super(project);

    const vscode = new VsCode(project);

    // VSCODE: Root level editor settings
    const vsSettings = new VsCodeSettings(vscode);
    vsSettings.addSetting('editor.tabSize', 2);
    vsSettings.addSetting('editor.bracketPairColorization.enabled', true);
    vsSettings.addSetting('editor.guides.bracketPairs', 'active');
    vsSettings.addSetting('editor.rulers', [80, 120]);

    // VSCODE: linting
    vsSettings.addSetting('editor.codeActionsOnSave', { 'source.fixAll.eslint': true });
    vsSettings.addSetting('editor.formatOnSave', false);
    vsSettings.addSetting('editor.formatOnSave', true, 'typescript');
    vsSettings.addSetting('editor.defaultFormatter', 'dbaeumer.vscode-eslint', 'typescript');

    // VSCODE: extensions
    const vsExtensions = new VsCodeRecommendedExtensions(vscode);
    vsExtensions.addRecommendations('dbaeumer.vscode-eslint');
  }
}

