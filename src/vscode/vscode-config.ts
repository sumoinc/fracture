import { Component, Project } from "projen";
import {
  VsCode,
  VsCodeRecommendedExtensions,
  VsCodeSettings,
} from "projen/lib/vscode";

export class VsCodeConfig extends Component {
  private vscode: VsCode;

  constructor(public readonly project: Project) {
    super(project);

    this.vscode = new VsCode(project);
  }

  preSynthesize(): void {
    super.preSynthesize();

    // VSCODE: Root level editor settings
    const vsSettings = new VsCodeSettings(this.vscode);
    vsSettings.addSetting("editor.tabSize", 2);
    vsSettings.addSetting("editor.bracketPairColorization.enabled", true);
    vsSettings.addSetting("editor.guides.bracketPairs", "active");
    vsSettings.addSetting("editor.rulers", [80, 120]);

    // use eslint to fix files for typescript files only
    vsSettings.addSetting(
      "editor.codeActionsOnSave",
      { "source.fixAll.eslint": "explicit" },
      "typescript"
    );

    // make sure each directory's eslint is found properly.
    vsSettings.addSetting("eslint.workingDirectories", [{ mode: "auto" }]);

    // VSCODE: extensions
    const vsExtensions = new VsCodeRecommendedExtensions(this.vscode);
    // vsExtensions.addRecommendations("esbenp.prettier-vscode");
    vsExtensions.addRecommendations("dbaeumer.vscode-eslint");
  }
}
