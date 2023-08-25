import { join } from "path";
import { TextFile, TextFileOptions } from "projen";
import { FractureService } from "../core/fracture-service";

export type GeneratedFileOptions = TextFileOptions;

export class GeneratedFile extends TextFile {
  constructor(
    service: FractureService,
    filePath: string,
    options: GeneratedFileOptions = { readonly: false }
  ) {
    super(service, join(service.srcdir, "generated", filePath), options);
  }
}
