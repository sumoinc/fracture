import {
  ListFormat,
  NewLineKind,
  ScriptKind,
  ScriptTarget,
  createPrinter,
  createSourceFile,
} from "typescript";

export class TypescriptFactory {
  /**
   *
   * Input must be an array, ven though it's not typed as such.
   */
  public static print = (nodes: any) => {
    const printer = createPrinter({ newLine: NewLineKind.LineFeed });
    const resultFile = createSourceFile(
      "temp.ts",
      "",
      ScriptTarget.Latest,
      false,
      ScriptKind.TS
    );

    return printer.printList(ListFormat.MultiLine, nodes, resultFile);
  };
}
