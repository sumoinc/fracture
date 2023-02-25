import { Gsi } from "./gsi";
import { FractureComponent } from "../core/component";
import { Service } from "../core/service";

export interface TableOptions {
  /**
   *  Name for the Shape.
   */
  name: string;
}

export class Table extends FractureComponent {
  public readonly name: string;
  public readonly primaryGsi: Gsi;

  constructor(service: Service, options: TableOptions) {
    super(service.fracture);

    this.name = options.name;
    this.primaryGsi = new Gsi(this, {
      name: "primary",
      pkName: "pk",
      skName: "sk",
    });
  }
}
