import { TypescriptOperation } from "./typescript-operation";
import { TypescriptService } from "./typescript-service";
import { TypescriptStructure } from "./typescript-structure";
import { FractureComponent } from "../../core";
import { Resource } from "../../core/resource";
import { Service } from "../../core/service";

export class TypescriptResource extends FractureComponent {
  public readonly resource: Resource;
  public readonly tsService: TypescriptService;

  constructor(tsService: TypescriptService, resource: Resource) {
    super(resource.fracture);

    this.resource = resource;
    this.tsService = tsService;

    new TypescriptStructure(this, this.resource.dataStructure);

    // add operations
    this.resource.operations.forEach((operation) => {
      new TypescriptOperation(this, operation);
    });
  }

  public get service(): Service {
    return this.resource.service;
  }
}
