import { buildTypes } from "./factories/build-type";
import { printNodes } from "./factories/print-nodes";
import { FractureService } from "../../core/fracture-service";
import { GeneratedTypescriptFile } from "../generated-typescript-file";

export class GenerateTypes extends GeneratedTypescriptFile {
  constructor(service: FractureService) {
    super(service, "types.ts");
  }

  preSynthesize(): void {
    super.preSynthesize();

    /***************************************************************************
     * Service Level Types
     **************************************************************************/

    const service = this.project as FractureService;
    const serviceTypes = buildTypes({
      service,
      structures: service.structures,
    });

    // this loop seems useless but it creates empty lines between each type.
    serviceTypes.forEach((type) => {
      this.addLine(printNodes([type]));
    });

    service.resources.forEach((resource) => {
      // baseline data entities
      const resourceTypes = buildTypes({
        service,
        structures: resource.structures,
      });
      // this loop seems useless but it creates empty lines between each type.
      resourceTypes.forEach((type) => {
        this.addLine(printNodes([type]));
      });

      // inputs and outputs for each operation
      resource.operations.forEach((operation) => {
        const operationTypes = buildTypes({
          service,
          structures: operation.structures,
        });

        // this loop seems useless but it creates empty lines between each type.
        operationTypes.forEach((type) => {
          this.addLine(printNodes([type]));
        });
      });
    });
  }
}
