import { paramCase } from "change-case";
import { deepMerge } from "projen/lib/util";
import { DynamoTable } from "./dynamo-table";
import { FractureComponent } from "../core/component";
import { Service } from "../core/service";

export interface GsiOptions {
  name?: string;
  pkName?: string;
  skName?: string;
}

export class DynamoGsi extends FractureComponent {
  // parent
  public readonly table: DynamoTable;
  // member components
  // all other options
  public readonly options: Required<GsiOptions>;

  constructor(table: DynamoTable, options: GsiOptions = {}) {
    super(table.fracture);

    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     **************************************************************************/

    let defaultOptions: Required<GsiOptions> = {
      name: `gsi${table.dynamoGsi.length}`,
      pkName: `pk${table.dynamoGsi.length}`,
      skName: `sk${table.dynamoGsi.length}`,
    };

    /***************************************************************************
     *
     * INIT TABLE
     *
     **************************************************************************/

    // ensure name is param-cased
    const forcedOptions: Partial<GsiOptions> = {
      name: options.name
        ? paramCase(options.name)
        : paramCase(defaultOptions.name),
    };

    // all other options
    this.options = deepMerge([
      defaultOptions,
      options,
      forcedOptions,
    ]) as Required<GsiOptions>;

    // parent
    this.table = table;
    this.table.dynamoGsi.push(this);
  }

  public get name(): string {
    return this.options.name;
  }

  public get pkName(): string {
    return this.options.pkName;
  }

  public get skName(): string {
    return this.options.skName;
  }

  public get service(): Service {
    return this.table.service;
  }
}
