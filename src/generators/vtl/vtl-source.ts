import { join } from "path";
import { SourceCode } from "projen";
import { Service } from "../../core/fracture-service";

/**
 * Build a VTL file and make sure it's marked as being managed by
 * projen.
 */
export class VtlSource extends SourceCode {
  constructor(service: Service, public readonly filePath: string) {
    super(service.project, join(service.srcDir, filePath));
    return this;
  }

  // mark as managed
  preSynthesize() {
    this.line("## " + this.marker);
    this.line("\n");
    super.preSynthesize();
  }
}
