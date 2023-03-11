import { paramCase } from "change-case";
import { deepMerge } from "projen/lib/util";
import { DynamoGsi } from "./dynamo-gsi";
import { FractureComponent } from "../core/component";
import { Service } from "../core/service";

export interface TableOptions {
  /**
   *  Name for the Resource.
   */
  name: string;
  keyDynamoGsi?: DynamoGsi;
  lookupDynamoGsi?: DynamoGsi;
  /**
   * Global Secondary Indexes
   *
   * Also includes the KeyDynamoGsi and LookupGsi
   */
  dynamoGsi?: DynamoGsi[];
}

export class DynamoTable extends FractureComponent {
  // parent
  public readonly service: Service;
  // member components
  public dynamoGsi: DynamoGsi[] = [];
  // all other options
  public readonly options: Required<TableOptions>;

  constructor(service: Service, options: TableOptions) {
    super(service.fracture);

    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     **************************************************************************/

    let defaultOptions: Partial<TableOptions> = {
      keyDynamoGsi: new DynamoGsi(this, {
        name: "primary",
        pkName: "pk",
        skName: "sk",
      }),
      lookupDynamoGsi: new DynamoGsi(this, {
        name: "gsi0",
        pkName: "sk",
        skName: "idx",
      }),
    };

    /***************************************************************************
     *
     * INIT TABLE
     *
     **************************************************************************/

    // ensure name is param-cased
    const forcedOptions: Partial<TableOptions> = {
      name: paramCase(options.name),
    };

    // all other options
    this.options = deepMerge([
      defaultOptions,
      options,
      forcedOptions,
    ]) as Required<TableOptions>;

    // parent
    this.service = service;

    // members

    return this;
  }

  public get name(): string {
    return this.options.name;
  }

  public get keyDynamoGsi(): DynamoGsi {
    return this.options.keyDynamoGsi;
  }

  public get lookupDynamoGsi(): DynamoGsi {
    return this.options.lookupDynamoGsi;
  }
}
