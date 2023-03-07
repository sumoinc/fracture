import { DynamoCommand } from "./dynamodb/dynamo-command";
import { TypescriptResource } from "./typescript-resource";
import { TypescriptService } from "./typescript-service";
import { FractureComponent } from "../../core";
import { Operation } from "../../core/operation";
import { Resource } from "../../core/resource";
import { Service } from "../../core/service";

export class TypescriptOperation extends FractureComponent {
  public readonly operation: Operation;
  public readonly resource: Resource;
  public readonly service: Service;
  public readonly tsResource: TypescriptResource;
  public readonly tsService: TypescriptService;

  constructor(tsResource: TypescriptResource, operation: Operation) {
    super(operation.fracture);

    this.operation = operation;
    this.resource = operation.resource;
    this.service = operation.service;
    this.tsResource = tsResource;
    this.tsService = tsResource.tsService;

    // create dynamo command
    new DynamoCommand(this);
  }
}
