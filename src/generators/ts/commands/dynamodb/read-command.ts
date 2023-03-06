import { DynamoCommand } from "./dynamo-command";
import { Operation } from "../../../../core/operation";

export class ReadCommand extends DynamoCommand {
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

    // construct the needed shape
    this.writeItem();
    this.writeKey();

    // the operation
    this.line(`/**`);
    this.line(` * Try to read the data from dynamo.`);
    this.line(` */`);
    this.open(`const result = await dynamo.send(`);
    this.open(`new GetCommand({`);
    this.line(`TableName: tableName,`);
    this.line(`Key: marshall(${this.keyVariable}),`);
    this.close(`})`);
    this.close(`);`);

    //close the handler function
    this.writeCommandClose();

    super.preSynthesize();
  }
}
