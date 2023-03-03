import { BaseCommand, BaseCommandOptions } from "./base-command";
import { Operation } from "../../../core/operation";

export class ReadCommand extends BaseCommand {
  constructor(
    operation: Operation,
    commandPath: string,
    options: BaseCommandOptions
  ) {
    super(operation, commandPath, options);
  }

  preSynthesize() {
    // imports
    this.writeClientImports();
    this.writeLambdaEventImport();
    this.writeUuidImport();
    this.writeInterfaceImport();
    this.line(`\n`);

    // define the client
    this.writeClient();

    // open function
    this.writeHandlerOpen();

    // init shape
    this.writeShape();

    // read the item from the database
    this.line(`/**`);
    this.line(` * Try to read the data.`);
    this.line(` */`);
    this.open(`const result = await dynamo.send(`);
    this.open(`new GetCommand({`);
    this.line(`TableName: tableName,`);
    this.line(`Key: marshall(key),`);
    this.close(`})`);
    this.close(`);`);

    // did we get a result?
    this.open(`if (result.Item) {`);
    this.line(
      `return unmarshall(result.Item) as ${this.resource.interfaceName};`
    );
    this.close(`}`);

    // return and close function
    this.line(`throw new Error("item not found");`);
    this.writeHandlerClose();

    super.preSynthesize();
  }
}
