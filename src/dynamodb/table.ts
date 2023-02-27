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
  public readonly keyGsi: Gsi;
  public readonly gsi: Gsi[];

  constructor(service: Service, options: TableOptions) {
    super(service.fracture);

    this.name = options.name;
    this.keyGsi = new Gsi(this, {
      name: "primary",
      pkName: "pk",
      skName: "sk",
    });
    this.gsi = [
      new Gsi(this, {
        name: "gsi0",
        pkName: "pk0",
        skName: "sk0",
      }),
    ];
  }
}
