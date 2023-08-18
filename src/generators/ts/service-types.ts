import { TextFile, TextFileOptions } from "projen";
import { toTypes } from "./factories/type";
import { printNodes } from "./factories/typescript-factory";
import { FractureService } from "../../core/fracture-service";

export class TypescriptServiceTypes extends TextFile {
  constructor(
    service: FractureService,
    filePath: string,
    options: TextFileOptions = {}
  ) {
    super(service, filePath, options);
  }

  synthesize(): void {
    /***************************************************************************
     * Service Level Types
     **************************************************************************/

    const service = this.project as FractureService;
    const serviceTypes = toTypes({
      service,
      structures: service.structures,
    });

    // this loop seems useless but it creates empty lines between each type.
    serviceTypes.forEach((type) => {
      this.addLine(printNodes([type]));
    });

    service.resources.forEach((resource) => {
      // baseline data entities
      const resourceTypes = toTypes({
        service,
        structures: resource.structures,
      });
      // this loop seems useless but it creates empty lines between each type.
      resourceTypes.forEach((type) => {
        this.addLine(printNodes([type]));
      });

      // inputs and outputs for each operation
      resource.operations.forEach((operation) => {
        const operationTypes = toTypes({
          service,
          structures: operation.structures,
        });

        // this loop seems useless but it creates empty lines between each type.
        operationTypes.forEach((type) => {
          this.addLine(printNodes([type]));
        });
      });
    });

    super.synthesize();
  }
}
