import { Component, YamlFile } from "projen";
import { FractureProject } from "../core";

export class PnpmWorkspace extends Component {
  constructor(fractureProject: FractureProject) {
    super(fractureProject);

    const { packageDir, appDir } = fractureProject;

    // write pnpm-workspace.yml file
    new YamlFile(this.project, "pnpm-workspace.yaml", {
      obj: {
        packages: [`${packageDir}/*`, `${appDir}/*`],
      },
    });
  }
}
