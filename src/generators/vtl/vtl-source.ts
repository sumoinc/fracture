import { SourceCode } from "projen";
import { Fracture } from "../../core";

/**
 * Build a VTL file and make sure it's marked as being managed by
 * projen.
 */
export class VtlSource extends SourceCode {
  constructor(fracture: Fracture, public readonly filePath: string) {
    super(fracture.project, fracture.outdir + "/" + filePath);
    this.line("// " + this.marker);
    this.line("\n");
    return this;
  }
}
