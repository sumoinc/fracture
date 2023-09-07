import { TypeScriptProject } from "projen/lib/typescript";
import { GeneratedFile, GeneratedFileOptions } from "./generated-file";

export type GeneratedTypescriptFileOptions = GeneratedFileOptions;

export class GeneratedTypescriptFile extends GeneratedFile {
  constructor(
    public readonly project: TypeScriptProject,
    filePath: string,
    options: GeneratedTypescriptFileOptions = {}
  ) {
    super(project, filePath, options);

    // ensure proper file exstension
    if (filePath.split(".").pop() !== "ts") {
      throw new Error("GeneratedTypescriptFile must have a .ts extension");
    }
  }

  preSynthesize() {
    this.addLine("// " + this.marker);
    this.addLine("");
    super.preSynthesize();
  }
}
