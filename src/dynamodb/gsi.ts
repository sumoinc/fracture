import { Table } from "./table";
import { FractureComponent } from "../core/component";

export interface GsiOptions {
  name: string;
  pkName: string;
  skName: string;
}

export class Gsi extends FractureComponent {
  public readonly table: Table;
  public readonly pkName: string;
  public readonly skName: string;

  constructor(table: Table, options: GsiOptions) {
    super(table.fracture);

    this.table = table;
    this.pkName = options.pkName;
    this.skName = options.skName;
  }
}
