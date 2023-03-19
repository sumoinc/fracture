import { TypescriptOperation } from "./typescript-operation";
import { TypescriptService } from "./typescript-service";
import { TypescriptStructure } from "./typescript-structure";
import { FractureComponent } from "../../core";
import { Resource } from "../../core/resource";
import { Service } from "../../core/service";

export class TypescriptResource extends FractureComponent {
  public readonly resource: Resource;
  public readonly tsService: TypescriptService;
  public readonly tsDataStructure: TypescriptStructure;
  public readonly tsTransientStructure: TypescriptStructure;
  public readonly tsOperations: TypescriptOperation[] = [];

  constructor(tsService: TypescriptService, resource: Resource) {
    super(resource.fracture);

    this.resource = resource;
    this.tsService = tsService;
    tsService.tsResources.push(this);

    this.project.logger.info(`TS:INIT Resource: "${this.resource.name}"`);

    this.tsDataStructure = new TypescriptStructure(
      this,
      this.resource.dataStructure
    );
    this.tsTransientStructure = new TypescriptStructure(
      this,
      this.resource.transientStructure
    );

    // add operations
    this.resource.operations.forEach((operation) => {
      new TypescriptOperation(this, operation);
    });
  }

  public build() {
    this.tsDataStructure.writePublicInterface(this.tsService.typeFile);
    this.tsTransientStructure.writePublicInterface(this.tsService.typeFile);

    this.tsOperations.forEach((tsOperation) => {
      tsOperation.build();
    });
  }

  public get service(): Service {
    return this.resource.service;
  }
}
