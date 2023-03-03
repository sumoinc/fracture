import { dirname, join, relative, sep } from "path";
import { SourceCode } from "projen";
import { Service } from "../../core/service";

/**
 * Build a TypeScript file and make sure it's marked as being managed by
 * projen.
 */
export class TypeScriptSource extends SourceCode {
  constructor(service: Service, public readonly filePath: string) {
    super(service.project, filePath);
    return this;
  }

  public pathFrom(fromFile: TypeScriptSource): string {
    const relativeDir = relative(
      dirname(fromFile.filePath),
      dirname(this.filePath)
    );
    return join(relativeDir, this.fileName.split(".")[0]);
  }

  public get fileName(): string {
    return this.filePath.split(sep).pop() as string;
  }

  // mark as managed
  preSynthesize() {
    this.line("// " + this.marker);
    this.line("\n");
    super.preSynthesize();
  }
}
