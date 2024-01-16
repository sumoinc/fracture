import { TypeScriptProject } from "projen/lib/typescript";
import { GeneratedFile, GeneratedFileOptions } from "./generated-file";

export type GeneratedGraphQlFileOptions = GeneratedFileOptions;

export class GeneratedGraphQlFile extends GeneratedFile {
  constructor(
    public readonly project: TypeScriptProject,
    filePath: string = "schema.graphql",
    options: GeneratedGraphQlFileOptions = {}
  ) {
    super(project, filePath, options);

    // ensure proper file exstension
    if (filePath.split(".").pop() !== "graphql") {
      throw new Error("GeneratedGraphQlFile must have a .graphql extension");
    }
  }

  preSynthesize() {
    this.addLine("# " + this.marker);
    this.addLine("\n");
    super.preSynthesize();
  }
}
