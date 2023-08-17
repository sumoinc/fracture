import { Component } from "projen";
import { Operation } from "../../core/operation.ts-disabled";

export class TypescriptOperation extends Component {
  public readonly operation: Operation;

  constructor(operation: Operation) {
    super(operation.project);

    this.operation = operation;

    this.project.logger.info(`TS:INIT Operation: "${this.operation.name}"`);

    return this;
  }
}
