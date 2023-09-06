import { NodeProject } from "projen/lib/javascript";
import { GeneratedFile, GeneratedFileOptions } from "./generated-file";

export type GeneratedVtlFileOptions = GeneratedFileOptions;

export class GeneratedVtlFile extends GeneratedFile {
  constructor(
    public readonly project: NodeProject,
    filePath: string,
    options: GeneratedVtlFileOptions = {}
  ) {
    super(project, filePath, options);
  }

  preSynthesize() {
    this.addLine("## " + this.marker);
    this.addLine("\n");
    super.preSynthesize();
  }
}
