import { dirname, join, relative, sep } from "path";
import { SourceCode, SourceCodeOptions } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { TypescriptStrategy } from "./strategy";
import { FractureService } from "../../core";

export interface TypeScriptSourceOptions extends SourceCodeOptions {}

/**
 * Build a TypeScript file and make sure it's marked as being managed by
 * projen.
 */
export class TypeScriptSource extends SourceCode {
  /**
   * full filepathfor this file.
   */
  public readonly filePath: string;
  /**
   * fFilename, without path.
   */
  public readonly fileName: string;
  /**
   * The naming strategy to use for this file.
   */
  public readonly strategy: TypescriptStrategy;

  constructor(
    service: FractureService,
    filePath: string,
    options?: TypeScriptSourceOptions
  ) {
    super(service, filePath, {
      // make the file editable so that prettier can format it
      readonly: false,
      ...options,
    });

    /***************************************************************************
     * Props
     **************************************************************************/

    this.filePath = filePath;
    this.fileName = this.filePath.split(sep).pop() as string;
    this.strategy = new TypescriptStrategy(service);

    return this;
  }

  /**
   * Add multiple l;ines to the file at one time.
   * @param lines
   */
  public comments(lines: string[]): void {
    this.line("/**");
    lines.forEach((line) => this.line(` * ${line}`));
    this.line(" */");
  }

  /**
   * Add multiple l;ines to the file at one time.
   * @param lines
   */
  public lines(lines: string[]): void {
    lines.forEach((line) => this.line(line));
  }

  public pathFrom(fromFile: TypeScriptSource): string {
    const relativeDir = relative(
      dirname(fromFile.filePath),
      dirname(this.filePath)
    );
    return join(relativeDir, this.fileName.split(".")[0]);
  }

  preSynthesize() {
    // mark as managed
    this.line("// " + this.marker);
    this.line("\n");
    // make sure prettier isn't ignoring it so we can clean it up and format it
    const project = this.project as TypeScriptProject;
    project.prettier?.addIgnorePattern(`!${this.filePath}`);
    // call parent
    super.preSynthesize();
  }
}
