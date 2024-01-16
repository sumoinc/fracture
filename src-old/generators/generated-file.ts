import { join } from "path";
import { TextFile, TextFileOptions } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { Settings } from "../settings";

export type GeneratedFileOptions = TextFileOptions;

export class GeneratedFile extends TextFile {
  constructor(
    public readonly project: TypeScriptProject,
    filePath: string,
    options: GeneratedFileOptions = {}
  ) {
    const settings = Settings.of(project);

    super(project, join(settings.srcDirectory, filePath), {
      readonly: false,
      ...options,
    });
  }
}
