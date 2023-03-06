import {
  BaseServiceCommand,
  BaseServiceCommandOptions,
} from "./base-service-command";
import { Operation } from "../../../core/operation";

export class CreateServiceHandler extends BaseServiceCommand {
  constructor(
    operation: Operation,
    commandPath: string,
    options: BaseServiceCommandOptions
  ) {
    super(operation, commandPath, options);
  }

  preSynthesize() {
    // imports
    this.writeLambdaEventImport();
    this.writeInterfaceImport();
    this.line(
      `import { ${this.commandName} } from "${this.commandFile.pathFrom(
        this
      )}";`
    );
    this.line(`\n`);

    // open the handler function
    this.writeHandlerOpen();

    //
    this.line(`return ${this.commandName}(event.arguments);`);

    //close the handler function
    this.writeHandlerClose();

    super.preSynthesize();
  }
}
