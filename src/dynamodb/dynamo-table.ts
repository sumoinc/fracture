import { paramCase } from "change-case";
import { Component } from "projen";
import { DynamoGsi, DYNAMO_GSI_TYPE } from "./dynamo-gsi";
import { Fracture } from "../core";

export interface DynamoTableOptions {
  /**
   * Name for the Resource.
   * @default: uses service name
   */
  name?: string;
  /**
   * Name to use for PK attribute.
   * @default: "pk"
   */
  pkName?: string;
  /**
   * Name to use for SK attribute.
   * @default: "sk"
   */
  skName?: string;
  /**
   * Name to use for Lookup attribute.
   * @default: "idx"
   */
  lookupName?: string;
}

export class DynamoTable extends Component {
  constructor(fracture: Fracture, options: DynamoTableOptions = {}) {
    super(fracture);

    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     * We'll glue the name or requested outdir to the primary fracture outdir
     *
     **************************************************************************/

    let defaultOptions: Required<DynamoTableOptions> = {
      name: paramCase(service.name),
      pkName: "pk",
      skName: "sk",
      lookupName: "idx",
    };

    /***************************************************************************
     *
     * INIT TABLE
     *
     **************************************************************************/

    // ensure name is param-cased
    const forcedOptions: Partial<DynamoTableOptions> = {
      name: options.name ? paramCase(options.name) : paramCase(service.name),
    };

    // parent
    this.service = service;

    // compine options
    this.options = {
      ...defaultOptions,
      ...options,
      ...forcedOptions,
    };

    return this;
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

  public get lookupName(): string {
    return this.options.lookupName;
  }

  public get attrributeNames(): string[] {
    return this.dynamoGsi.reduce((acc, gsi) => {
      if (acc.indexOf(gsi.pkName) === -1) {
        acc.push(gsi.pkName);
      }
      if (acc.indexOf(gsi.skName) === -1) {
        acc.push(gsi.skName);
      }
      return acc;
    }, [] as string[]);
  }

  public get keyDynamoGsi(): DynamoGsi {
    let dynamoGsi = this.dynamoGsi.find((g) => g.isKeyGsi);

    // create the key GSI
    if (!dynamoGsi) {
      dynamoGsi = new DynamoGsi(this, {
        pkName: this.pkName,
        skName: this.skName,
        type: DYNAMO_GSI_TYPE.KEY,
      });
    }

    return dynamoGsi;
  }

  public get lookupDynamoGsi(): DynamoGsi {
    let dynamoGsi = this.dynamoGsi.find((g) => g.isLookupGsi);

    // create the key GSI
    if (!dynamoGsi) {
      dynamoGsi = new DynamoGsi(this, {
        name: "lookup",
        pkName: "sk",
        skName: "idx",
        type: DYNAMO_GSI_TYPE.LOOKUP,
      });
    }

    return dynamoGsi;
  }
}
