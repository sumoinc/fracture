import { DynamoCommand } from "./dynamodb/dynamo-command";
import { TypescriptResource } from "./typescript-resource";
import { TypescriptService } from "./typescript-service";
import { FractureComponent } from "../../core";
import { Operation } from "../../core/operation";

export class TypescriptOperation extends FractureComponent {
  public readonly operation: Operation;
  public readonly tsResource: TypescriptResource;
  public readonly tsService: TypescriptService;

  constructor(tsResource: TypescriptResource, operation: Operation) {
    super(operation.fracture);

    this.operation = operation;
    this.tsResource = tsResource;
    this.tsService = tsResource.tsService;

    // create dynamo command
    new DynamoCommand(this);
  }
}
