import {
  BaseServiceCommand,
  BaseServiceCommandOptions,
} from "./base-service-command";
import { Operation } from "../../../core/operation";

export class DeleteServiceHandler extends BaseServiceCommand {
  constructor(
    operation: Operation,
    commandPath: string,
    options: BaseServiceCommandOptions
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
