import { DynamoCommand } from "./dynamo-command";
import { Operation } from "../../../core/operation";
import { TypeScriptSource } from "../typescript-source";

export class DynamoReadOneCommand extends DynamoCommand {
  constructor(operation: Operation) {
    super(operation);
  }

  public writeDynamoCommand = (tsFile: TypeScriptSource): void => {
    // We need the key to read the item
    this.generateKey(tsFile);
  };

  public writeReturnData = (tsFile: TypeScriptSource): void => {
    // data
    tsFile.comments([`Expand/comnvert data to output format.`]);
    tsFile.open(`const data = (result.Item)`);
    tsFile.open(`? {`);
    this.outputStructure.publicAttributes.forEach((a) => {
      tsFile.line(
        `${a.ts.attributeName}: result.Item.${a.ts.attributeShortName},`
      );
    });
    tsFile.close(`} : undefined;`);
    tsFile.close("");
    tsFile.line("");

    // errors
    tsFile.comments([`Log error if no records found.`]);
    tsFile.open(`if (!result.Item) {`);
    tsFile.line(`status = 404;`);
    tsFile.open(`errors.push({ `);
    tsFile.line(`code: 12345,`);
    tsFile.line(`source: "TODO",`);
    tsFile.line(`message: "TODO - Item not found based on inputs.",`);
    tsFile.line(`detail: "TODO",`);
    tsFile.close(`})`);
    tsFile.close(`}`);
    tsFile.line("");
  };
}
