import { dirname, join, relative, sep } from "path";
import { Component, SourceCode, SourceCodeOptions } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";

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
    // make the file editable so that prettier can format it
    const defaultOptions = {
      readonly: false,
    };

    super(fractureComponent.project, filePath, {
      ...defaultOptions,
      ...options,
    });

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
