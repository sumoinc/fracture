import { FractureComponent } from "../../core/component";
import { Operation } from "../../core/operation";

export class TypescriptOperation extends FractureComponent {
  public readonly operation: Operation;

  constructor(operation: Operation) {
    super(operation.fracturePackage);

    this.operation = operation;

    this.project.logger.info(`TS:INIT Operation: "${this.operation.name}"`);

    return this;
  }

  public build() {}
}
