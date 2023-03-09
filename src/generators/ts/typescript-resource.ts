import { TypescriptOperation } from "./typescript-operation";
import { TypescriptService } from "./typescript-service";
import { FractureComponent } from "../../core";
import { Resource } from "../../core/resource";
import { Service } from "../../core/service";

export class TypescriptResource extends FractureComponent {
  public readonly resource: Resource;
  public readonly service: Service;
  public readonly tsService: TypescriptService;

  constructor(tsService: TypescriptService, resource: Resource) {
    super(resource.fracture);

    this.resource = resource;
    this.service = resource.service;
    this.tsService = tsService;

    // add operations
    this.resource.operations.forEach((operation) => {
      new TypescriptOperation(this, operation);
    });
  }
}
