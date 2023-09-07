import { Service } from "../../services/service";
import { GeneratedTypescriptFile } from "../generated-typescript-file";

export class Command extends GeneratedTypescriptFile {
  constructor(public readonly project: Service) {
    super(project, "command.ts");
  }
}
