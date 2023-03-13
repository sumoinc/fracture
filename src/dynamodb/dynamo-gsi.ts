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
  public readonly dynamoTable: DynamoTable;
  // member components
  // all other options
  public readonly options: Required<GsiOptions>;

  constructor(dynamoTable: DynamoTable, options: GsiOptions = {}) {
    super(dynamoTable.fracture);

    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     **************************************************************************/

    let defaultOptions: Required<GsiOptions> = {
      name: `gsi${dynamoTable.dynamoGsi.length}`,
      pkName: `pk${dynamoTable.dynamoGsi.length}`,
      skName: `sk${dynamoTable.dynamoGsi.length}`,
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
    this.dynamoTable = dynamoTable;
    this.dynamoTable.dynamoGsi.push(this);
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
    return this.dynamoTable.service;
  }
}
