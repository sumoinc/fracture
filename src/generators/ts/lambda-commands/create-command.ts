import { BaseCommand, BaseCommandOptions } from "./base-command";
import { Operation } from "../../../core/operation";

export class CreateCommand extends BaseCommand {
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

    // generate dynamo client
    this.writeClient();

    // open the handler function
    this.writeHandlerOpen();

    // construct the needed shape
    this.writeShape();

    //close the handler function
    this.writeHandlerClose();

    super.preSynthesize();
  }
}
