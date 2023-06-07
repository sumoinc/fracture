import { Component, YamlFile } from "projen";
import { Fracture } from "../core";

export class PnpmWorkspace extends Component {
  constructor(fracture: Fracture) {
    super(fracture);

    const { packageRoot, appRoot } = fracture;

    // write pnpm-workspace.yml file
    new YamlFile(this.project, "pnpm-workspace.yaml", {
      obj: {
        packages: [`${packageRoot}/*`, `${appRoot}/*`],
      },
    });
  }
}