import { ShapeAttribute } from "./attribute";
import { Shape } from "./shape";
import { FractureComponent } from "../core/component";

export interface AccessPatternOptions {
  pk: string[];
  sk: string[];
}

export class AccessPattern extends FractureComponent {
  public readonly shape: Shape;
  private readonly _pk: string[];
  private readonly _sk: string[];

  constructor(shape: Shape, options: AccessPatternOptions) {
    super(shape.fracture);

    this.shape = shape;
    this._pk = options.pk;
    this._sk = options.sk;
  }

  public get pk(): ShapeAttribute[] {
    return this._pk.map(
      (name) => this.shape.attributes.filter((a) => a.name === name)[0]
    );
  }

  public get sk(): ShapeAttribute[] {
    return this._sk.map(
      (name) => this.shape.attributes.filter((a) => a.name === name)[0]
    );
  }
}
