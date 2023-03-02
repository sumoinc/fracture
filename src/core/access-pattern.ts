import { Resource } from "./resource";
import { ResourceAttribute } from "./resource-attribute";
import { FractureComponent } from "../core/component";

export interface AccessPatternOptions {
  pk: string[];
  sk: string[];
}

export class AccessPattern extends FractureComponent {
  public readonly resource: Resource;
  private readonly _pk: string[];
  private readonly _sk: string[];

  constructor(resource: Resource, options: AccessPatternOptions) {
    super(resource.fracture);

    this.resource = resource;
    this._pk = options.pk;
    this._sk = options.sk;
  }

  public get pk(): ResourceAttribute[] {
    return this._pk.map(
      (name) => this.resource.attributes.filter((a) => a.name === name)[0]
    );
  }

  public get sk(): ResourceAttribute[] {
    return this._sk.map(
      (name) => this.resource.attributes.filter((a) => a.name === name)[0]
    );
  }
}
