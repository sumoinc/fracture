import { Gsi } from "./gsi";
import { FractureComponent } from "../core/component";
import { Fracture } from "../core/fracture";

export interface TableOptions {
  /**
   *  Name for the Entity.
   */
  name: string;
}

export class Table extends FractureComponent {
  public readonly name: string;
  public readonly primaryGsi: Gsi;

  constructor(fracture: Fracture, options: TableOptions) {
    super(fracture);

    this.name = options.name;
    this.primaryGsi = new Gsi(this, {
      name: "primary",
      pkName: "pk",
      skName: "sk",
    });
  }
}
