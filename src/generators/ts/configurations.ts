import { Service } from "../../services/service";
import { GeneratedTypescriptFile } from "../generated-typescript-file";

export class GenerateConfigurations extends GeneratedTypescriptFile {
  constructor(public readonly project: Service) {
    super(project, "configurations.ts");
  }

  preSynthesize(): void {
    super.preSynthesize();

    //const service = this.project as FractureService;
    const configs: Record<string, any> = {};

    /*
    ServiceDeployTarget.byService(service).forEach((sdt) => {
      configs[sdt.name] = {};
    });
    */

    this.addLine(
      `export const configurations = ${JSON.stringify(configs, null, 2)}`
    );
  }
}
