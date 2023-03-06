import { Fracture, FractureComponent } from "../core";

export interface RegionOptions {
  region: string;
}

export class Region extends FractureComponent {
  public readonly region: string;

  constructor(fracture: Fracture, options: RegionOptions) {
    super(fracture);
  }
}
