import { dirname, join, relative, sep } from "path";
import { Component, SourceCode, SourceCodeOptions } from "projen";

export interface TypeScriptSourceOptions extends SourceCodeOptions {}

/**
 * Build a TypeScript file and make sure it's marked as being managed by
 * projen.
 */
export class TypeScriptSource extends SourceCode {
  constructor(
    fractureComponent: Component,
    public readonly filePath: string,
    options?: TypeScriptSourceOptions
  ) {
    super(fractureComponent.project, filePath, options);

    this.project.logger.info(`TS:INIT Source File: "${this.fileName}"`);

    return this;
  }

  public get fileName(): string {
    return this.filePath.split(sep).pop() as string;
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

  // mark as managed
  preSynthesize() {
    this.line("// " + this.marker);
    this.line("\n");
    super.preSynthesize();
  }
}
