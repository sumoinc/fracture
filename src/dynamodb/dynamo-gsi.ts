import { paramCase } from "change-case";
import { Component } from "projen";
import { deepMerge } from "projen/lib/util";
import { ValueOf } from "type-fest";
import { DynamoTable } from "./dynamo-table";
import { Service } from "../core/fracture-service";

export const DYNAMO_GSI_TYPE = {
  /**
   * The PK and SK for this table.
   */
  KEY: "key",
  /**
   * Uses the SK plus idx for simple lookup patterns
   */
  LOOKUP: "lookup",
  /**
   * Any other GSI needed on the table
   */
  OTHER: "other",
} as const;

export interface DynamoGsiOptions {
  name?: string;
  pkName?: string;
  skName?: string;
  type?: ValueOf<typeof DYNAMO_GSI_TYPE>;
}

export class DynamoGsi extends Component {
  // parent
  public readonly dynamoTable: DynamoTable;
  // member components
  // all other options
  public readonly options: Required<DynamoGsiOptions>;

  constructor(dynamoTable: DynamoTable, options: DynamoGsiOptions = {}) {
    super(dynamoTable.project);

    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     **************************************************************************/

    let defaultOptions: Required<DynamoGsiOptions> = {
      name: `gsi${dynamoTable.dynamoGsi.length}`,
      pkName: `pk${dynamoTable.dynamoGsi.length}`,
      skName: `sk${dynamoTable.dynamoGsi.length}`,
      type: DYNAMO_GSI_TYPE.OTHER,
    };

    /***************************************************************************
     *
     * INIT TABLE
     *
     **************************************************************************/

    // ensure name is param-cased
    const forcedOptions: Partial<DynamoGsiOptions> = {
      name: options.name
        ? paramCase(options.name)
        : paramCase(defaultOptions.name),
    };

    // all other options
    this.options = deepMerge([
      defaultOptions,
      options,
      forcedOptions,
    ]) as Required<DynamoGsiOptions>;

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

  public get type(): string {
    return this.options.type;
  }

  public get isKeyGsi(): boolean {
    return this.type === DYNAMO_GSI_TYPE.KEY;
  }

  public get isLookupGsi(): boolean {
    return this.type === DYNAMO_GSI_TYPE.LOOKUP;
  }

  public get service(): Service {
    return this.dynamoTable.service;
  }
}
