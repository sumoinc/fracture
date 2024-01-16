import { TypeScriptProject } from "projen/lib/typescript";
import { GeneratedFile, GeneratedFileOptions } from "./generated-file";

export type GeneratedVtlFileOptions = GeneratedFileOptions;

export class GeneratedVtlFile extends GeneratedFile {
  constructor(
    public readonly project: TypeScriptProject,
    filePath: string,
    options: GeneratedVtlFileOptions = {}
  ) {
    super(project, filePath, options);

    // ensure proper file exstension
    if (filePath.split(".").pop() !== "vtl") {
      throw new Error("GeneratedVtlFile must have a .vtl extension");
    }
  }

  preSynthesize() {
    this.addLine("## " + this.marker);
    this.addLine("\n");
    super.preSynthesize();
  }
}
