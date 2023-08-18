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
    const types = toTypes({
      service,
      structures: service.structures,
    });

    types.forEach((type) => {
      this.addLine(printNodes([type]));
    });

    super.synthesize();
  }
}
