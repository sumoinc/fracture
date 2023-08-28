import { FractureService } from "../../core/fracture-service";
import { ServiceDeployTarget } from "../../pipelines";
import { GeneratedTypescriptFile } from "../generated-typescript-file";

export class GeneratedConfigurations extends GeneratedTypescriptFile {
  constructor(service: FractureService) {
    super(service, "configurations.ts");
  }

  preSynthesize(): void {
    super.preSynthesize();

    const service = this.project as FractureService;
    const configs: Record<string, any> = {};

    ServiceDeployTarget.byService(service).forEach((sdt) => {
      configs[sdt.name] = {};
    });

    this.addLine(
      `export const configurations = ${JSON.stringify(configs, null, 2)}`
    );
  }
}