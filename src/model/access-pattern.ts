import { Attribute } from "./attribute";
import { Entity } from "./entity";
import { FractureComponent } from "../core/component";

export interface AccessPatternOptions {
  pk: string[];
  sk: string[];
}

export class AccessPattern extends FractureComponent {
  public readonly entity: Entity;
  private readonly _pk: string[];
  private readonly _sk: string[];

  constructor(entity: Entity, options: AccessPatternOptions) {
    super(entity.fracture);

    this.entity = entity;
    this._pk = options.pk;
    this._sk = options.sk;
  }

  public get pk(): Attribute[] {
    return this._pk.map(
      (name) => this.entity.attributes.filter((a) => a.name === name)[0]
    );
  }

  public get sk(): Attribute[] {
    return this._sk.map(
      (name) => this.entity.attributes.filter((a) => a.name === name)[0]
    );
  }
}
