import { Fracture, FractureComponent } from ".";
import { Table } from "../dynamodb/table";
import { ApiGateway, AppSync } from "../generators";
import { TypeScriptModel } from "../generators/ts/typescript-model";
import { Entity, EntityOptions } from "../model";

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
    const isEntity = (c: FractureComponent): c is Entity =>
      c instanceof Entity &&
      c.namespace === this.namespace &&
      c.service.name === this.name;
    return (this.project.components as FractureComponent[]).filter(isEntity);
  }

  public addEntity(options: EntityOptions) {
    return new Entity(this, options);
  }
}
