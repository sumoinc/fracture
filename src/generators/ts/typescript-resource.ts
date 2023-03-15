import { TypescriptOperation } from "./typescript-operation";
import { TypescriptResourceAttribute } from "./typescript-resource-attribute";
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

    this.project.logger.info(`TS:INIT Resource: "${this.resource.name}"`);

    new TypescriptStructure(this, this.resource.dataStructure);
    new TypescriptStructure(this, this.resource.transientStructure);

    // add operations
    this.resource.operations.forEach((operation) => {
      new TypescriptOperation(this, operation);
    });
  }

  public get tsAttributes(): TypescriptResourceAttribute[] {
    return this.resource.attributes.map((attribute) => {
      return new TypescriptResourceAttribute(this, attribute);
    });
  }

  public get service(): Service {
    return this.resource.service;
  }
}
