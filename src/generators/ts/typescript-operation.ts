import { DynamoCommand } from "./dynamodb/dynamo-command";
import { TypescriptResource } from "./typescript-resource";
import { TypescriptService } from "./typescript-service";
import { TypescriptStructure } from "./typescript-structure";
import { FractureComponent } from "../../core";
import { Operation } from "../../core/operation";
import { Resource } from "../../core/resource";
import { Service } from "../../core/service";

export class TypescriptOperation extends FractureComponent {
  public readonly operation: Operation;
  public readonly tsResource: TypescriptResource;
  public readonly tsInputStructure: TypescriptStructure;
  public readonly tsOutputStructure: TypescriptStructure;
  public readonly tsDynamoCommand: DynamoCommand;

  constructor(tsResource: TypescriptResource, operation: Operation) {
    super(operation.fracture);

    this.operation = operation;
    this.tsResource = tsResource;
    tsResource.tsOperations.push(this);

    this.project.logger.info(`TS:INIT Operation: "${this.operation.name}"`);

    this.tsInputStructure = new TypescriptStructure(
      tsResource,
      this.operation.inputStructure
    );
    this.tsOutputStructure = new TypescriptStructure(
      tsResource,
      this.operation.outputStructure
    );

    // create dynamo command
    this.tsDynamoCommand = new DynamoCommand(this);
  }

  public build() {
    this.tsDynamoCommand.writeCommand();
    this.tsDynamoCommand.writeTest();
  }

  public get tsService(): TypescriptService {
    return this.tsResource.tsService;
  }

  public get service(): Service {
    return this.resource.service;
  }

  public get resource(): Resource {
    return this.operation.resource;
  }
}
