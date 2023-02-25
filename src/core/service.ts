import { Fracture, FractureComponent } from ".";
import { Table } from "../dynamodb/table";
import { ApiGateway, AppSync } from "../generators";
import { TypeScriptModel } from "../generators/ts/typescript-model";
import { Shape, ShapeOptions } from "../model";

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
   * Get all shapes for this service.
   */
  public get shapes(): Shape[] {
    const isShape = (c: FractureComponent): c is Shape =>
      c instanceof Shape &&
      c.namespace === this.namespace &&
      c.service.name === this.name;
    return (this.project.components as FractureComponent[]).filter(isShape);
  }

  public addShape(options: ShapeOptions) {
    return new Shape(this, options);
  }
}
