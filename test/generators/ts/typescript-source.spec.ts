import { TypeScriptSource } from "../../../src/generators/ts/typescript-source";
import { TestFracture } from "../../util";

test("Smoke test", () => {
  const tsFile = new TypeScriptSource(new TestFracture(), "foo.ts");
  expect(tsFile).toBeTruthy();
  expect(tsFile.filePath).toBe("foo.ts");
});
