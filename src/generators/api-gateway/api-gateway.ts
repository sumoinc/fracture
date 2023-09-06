import { Service } from "../../services/service";
import { GeneratedTypescriptFile } from "../generated-typescript-file";

export class ApiGateway extends GeneratedTypescriptFile {
  constructor(public readonly project: Service) {
    super(project, "api/api-gateway.ts");
  }
}
