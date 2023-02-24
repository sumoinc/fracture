import { Fracture, FractureComponent } from ".";
import { ApiGateway, AppSync } from "../generators";
import { TypeScriptModel } from "../generators/ts/typescript-model";
import { Entity } from "../model";

export interface ServiceOptions {
  name: string;
}

export class Service extends FractureComponent {
  public readonly name: string;

  constructor(fracture: Fracture, options: ServiceOptions) {
    super(fracture);

    this.name = options.name;

    /***************************************************************************
     *
     *  CODE GENERATION
     *
     *  Generate code for various services.
     *
     **************************************************************************/

    new TypeScriptModel(this);
    new AppSync(this);
    new ApiGateway(this);
  }

  /**
   * Get all entities for this service.
   */
  public get entities(): Entity[] {
    return this.fracture.entities;
  }
}
