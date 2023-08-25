import { GeneratedFile, GeneratedFileOptions } from "./generated-file";
import { FractureService } from "../core/fracture-service";

export type GeneratedTypescriptFileOptions = GeneratedFileOptions;

export class GeneratedTypescriptFile extends GeneratedFile {
  constructor(
    service: FractureService,
    filePath: string,
    options: GeneratedTypescriptFileOptions = { readonly: false }
  ) {
    super(service, filePath, options);
  }

  preSynthesize() {
    this.addLine("// " + this.marker);
    this.addLine("");
    super.preSynthesize();
  }
}
