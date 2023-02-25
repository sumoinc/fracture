import { join } from "path";
import { SourceCode } from "projen";
import { Service } from "../../core/service";

/**
 * Build a TypeScript file and make sure it's marked as being managed by
 * projen.
 */
export class TypeScriptSource extends SourceCode {
  constructor(service: Service, public readonly filePath: string) {
    super(service.project, join(service.outdir, filePath));
    this.line("// " + this.marker);
    this.line("\n");
    return this;
  }
}
