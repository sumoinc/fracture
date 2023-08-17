import { paramCase } from "change-case";
import { Component } from "projen";
import { DynamoAttribute } from "./dynamo-attribute";
import { FractureService } from "../core";

export interface DynamoGsiOptions {
  /**
   * Name for the GSI
   */
  name: string;
  /**
   * PK for the GSI
   */
  pk: DynamoAttribute;
  /**
   * SK for the GSI
   */
  sk: DynamoAttribute;
}

export class DynamoGsi extends Component {
  /**
   * Name for the GSI
   */
  public readonly name: string;
  /**
   * PK for the GSI
   */
  public readonly pk: DynamoAttribute;
  /**
   * SK for the GSI
   */
  public readonly sk: DynamoAttribute;

  constructor(service: FractureService, options: DynamoGsiOptions) {
    super(service);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = paramCase(options.name);
    this.pk = options.pk;
    this.sk = options.sk;
  }
}
