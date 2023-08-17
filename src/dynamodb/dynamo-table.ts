import { paramCase } from "change-case";
import { Component } from "projen";
import { DynamoGsi, DynamoGsiOptions } from "./dynamo-gsi";
import { FractureService } from "../core";
import { ResourceAttribute } from "../core/resource-attribute";

export interface DynamoTableOptions {
  /**
   * Name for the table.
   */
  name: string;
  /**
   * Name to use for PK attribute.
   *
   * @default: "pk"
   */
  pkName?: string;
  /**
   * Name to use for SK attribute.
   *
   * @default: "sk"
   */
  skName?: string;
  /**
   * Name to use for Lookup attribute.
   *
   * @default: "idx"
   */
  idxName?: string;
}

export class DynamoTable extends Component {
  /**
   * Name for the table.
   */
  public readonly name: string;
  public readonly pk: ResourceAttribute;
  public readonly sk: ResourceAttribute;
  public readonly idx: ResourceAttribute;
  public readonly keyGsi: DynamoGsi;
  public readonly lookupGsi: DynamoGsi;
  public readonly gsi: DynamoGsi[] = [];

  constructor(service: FractureService, options: DynamoTableOptions) {
    super(service);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = paramCase(options.name);
    const pkName = options.pkName ?? "pk";
    const skName = options.skName ?? "sk";
    const lookupName = options.idxName ?? "idx";
    this.pk = new ResourceAttribute(service, { name: pkName });
    this.sk = new ResourceAttribute(service, { name: skName });
    this.idx = new ResourceAttribute(service, {
      name: lookupName,
    });

    /***************************************************************************
     * Build Key GSI
     **************************************************************************/

    this.keyGsi = this.addGsi({
      name: "key",
      pk: this.pk,
      sk: this.sk,
    });

    /***************************************************************************
     * Build Lookup GSI
     **************************************************************************/

    this.lookupGsi = this.addGsi({
      name: "loookup",
      pk: this.sk,
      sk: this.idx,
    });

    return this;
  }

  public addGsi(options: DynamoGsiOptions) {
    const service = this.project as FractureService;
    const gsi = new DynamoGsi(service, options);
    this.gsi.push(gsi);
    return gsi;
  }

  // public get attrributeNames(): string[] {
  //   return this.dynamoGsi.reduce((acc, gsi) => {
  //     if (acc.indexOf(gsi.pkName) === -1) {
  //       acc.push(gsi.pkName);
  //     }
  //     if (acc.indexOf(gsi.skName) === -1) {
  //       acc.push(gsi.skName);
  //     }
  //     return acc;
  //   }, [] as string[]);
  // }

  // public get keyDynamoGsi(): DynamoGsi {
  //   let dynamoGsi = this.dynamoGsi.find((g) => g.isKeyGsi);

  //   // create the key GSI
  //   if (!dynamoGsi) {
  //     dynamoGsi = new DynamoGsi(this, {
  //       pkName: this.pkName,
  //       skName: this.skName,
  //       type: DYNAMO_GSI_TYPE.KEY,
  //     });
  //   }

  //   return dynamoGsi;
  // }

  // public get lookupDynamoGsi(): DynamoGsi {
  //   let dynamoGsi = this.dynamoGsi.find((g) => g.isLookupGsi);

  //   // create the key GSI
  //   if (!dynamoGsi) {
  //     dynamoGsi = new DynamoGsi(this, {
  //       name: "lookup",
  //       pkName: "sk",
  //       skName: "idx",
  //       type: DYNAMO_GSI_TYPE.LOOKUP,
  //     });
  //   }

  //   return dynamoGsi;
  // }
}
