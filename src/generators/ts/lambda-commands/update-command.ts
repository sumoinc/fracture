import { BaseCommand } from "./base-command";
import { Operation } from "../../../core/operation";

export class UpdateCommand extends BaseCommand {
  constructor(operation: Operation, commandPath: string) {
    super(operation, commandPath);
  }

  preSynthesize() {
    // imports
    this.writeClientImports();

    this.writeUuidImport();
    this.writeInterfaceImport();
    this.line(`\n`);

    // generate dynamo client
    this.writeClient();

    // open the handler function
    this.writeCommandOpen();

    // construct the needed shape
    this.writeShape();

    //close the handler function
    this.writeCommandClose();

    super.preSynthesize();
  }
}
