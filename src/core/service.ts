import { Fracture, FractureComponent } from ".";
import { Table } from "../dynamodb/table";
import { ApiGateway, AppSync } from "../generators";
import { TypeScriptModel } from "../generators/ts/typescript-model";
import { Entity } from "../model";

export interface ServiceOptions {
  name: string;
}

export class Service extends FractureComponent {
  public readonly name: string;
  public readonly dynamodb: Table;

  constructor(fracture: Fracture, options: ServiceOptions) {
    super(fracture);

    this.name = options.name;

    // each service gets it's own dynamodb table
    this.dynamodb = new Table(this, { name: this.name });

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
