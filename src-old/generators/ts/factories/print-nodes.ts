import {
  ListFormat,
  NewLineKind,
  ScriptKind,
  ScriptTarget,
  createPrinter,
  createSourceFile,
} from "typescript";

/**
 * Input must be an array, even though it's not typed as such.
 */
export const printNodes = (nodes: any) => {
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
