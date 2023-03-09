import { Gsi } from "./gsi";
import { FractureComponent } from "../core/component";
import { Service } from "../core/service";

export interface TableOptions {
  /**
   *  Name for the Resource.
   */
  name: string;
}

export class Table extends FractureComponent {
  public readonly name: string;
  public readonly keyGsi: Gsi;
  public readonly lookupGsi: Gsi;
  public readonly gsi: Gsi[];

  constructor(service: Service, options: TableOptions) {
    super(service.fracture);

    this.name = options.name;
    this.keyGsi = new Gsi(this, {
      name: "primary",
      pkName: "pk",
      skName: "sk",
    });
    this.lookupGsi = new Gsi(this, {
      name: "gsi0",
      pkName: "sk",
      skName: "idx",
    });
    this.gsi = [];
  }
}
