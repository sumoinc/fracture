import { DynamoCommand } from "./dynamo-command";
import { Operation } from "../../../../core/operation";

export class DeleteCommand extends DynamoCommand {
  constructor(operation: Operation, commandPath: string) {
    super(operation, commandPath);
  }

  preSynthesize() {
    // imports
    this.writeImports();
    this.line(`\n`);

    // generate dynamo client
    this.writeDynamoClient();

    // open the handler function
    this.writeCommandOpen();

    // construct the needed shape & key
    this.writeItem();
    this.writeKey();

    // the operation
    this.line(`/**`);
    this.line(` * Try to put the data in dynamo.`);
    this.line(` */`);
    this.open(`const result = await dynamo.send(`);
    this.open(`new DeleteCommand({`);
    this.line(`TableName: tableName,`);
    this.line(`Key: marshall(${this.keyVariable}),`);
    this.close(`})`);
    this.close(`);`);

    //close the handler function
    this.writeCommandClose();

    super.preSynthesize();
  }
}
