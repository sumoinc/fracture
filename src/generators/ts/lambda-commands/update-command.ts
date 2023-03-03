import { BaseCommand, BaseCommandOptions } from "./base-command";
import { Operation } from "../../../core/operation";

export class UpdateCommand extends BaseCommand {
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

    super.preSynthesize();
  }
}
