import { NodeProject } from "projen/lib/javascript";
import { GeneratedFile, GeneratedFileOptions } from "./generated-file";

export type GeneratedTypescriptFileOptions = GeneratedFileOptions;

export class GeneratedTypescriptFile extends GeneratedFile {
  constructor(
    public readonly project: NodeProject,
    filePath: string,
    options: GeneratedTypescriptFileOptions = {}
  ) {
    super(project, filePath, options);
  }

  preSynthesize() {
    this.addLine("// " + this.marker);
    this.addLine("");
    super.preSynthesize();
  }
}
