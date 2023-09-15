import { Service } from "../../services/service";
import { GeneratedTypescriptFile } from "../generated-typescript-file";

export class Configuration extends GeneratedTypescriptFile {
  constructor(public readonly project: Service) {
    super(project, "configuration.ts");
  }

  preSynthesize(): void {
    super.preSynthesize();

    this.addLine(
      `export const configurations = ${JSON.stringify(
        this.project.config(),
        null,
        2
      )}`
    );
  }
}
