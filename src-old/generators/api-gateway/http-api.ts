import { Service } from "../../services/service";
import { GeneratedTypescriptFile } from "../generated-typescript-file";

export class HttpApi extends GeneratedTypescriptFile {
  constructor(public readonly project: Service) {
    super(project, "api-gateway/http-api.ts");
  }
}
