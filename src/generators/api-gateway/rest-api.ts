import { Service } from "../../services/service";
import { GeneratedTypescriptFile } from "../generated-typescript-file";

export class RestApi extends GeneratedTypescriptFile {
  constructor(public readonly project: Service) {
    super(project, "api-gateway/rest-api.ts");
  }
}
