import { buildTypes } from "./factories/build-type";
import { printNodes } from "./factories/print-nodes";
import { Service } from "../../services/service";
import { Structure } from "../../services/structure";
import { GeneratedTypescriptFile } from "../generated-typescript-file";

export class Types extends GeneratedTypescriptFile {
  constructor(public readonly project: Service) {
    super(project, "types.ts");
  }

  preSynthesize(): void {
    super.preSynthesize();

    buildTypes({
      service: this.project,
      structures: Structure.all(this.project),
    }).forEach((type) => {
      this.addLine(printNodes([type]));
    });
  }
}
