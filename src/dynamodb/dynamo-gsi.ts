import { paramCase } from "change-case";
import { Component } from "projen";
import { FractureService } from "../core";
import { ResourceAttribute } from "../core/resource-attribute";

export interface DynamoGsiOptions {
  /**
   * Name for the GSI
   */
  name: string;
  /**
   * PK for the GSI
   */
  pk: ResourceAttribute;
  /**
   * SK for the GSI
   */
  sk: ResourceAttribute;
  //type?: ValueOf<typeof DYNAMO_GSI_TYPE>;
}

export class DynamoGsi extends Component {
  /**
   * Name for the GSI
   */
  public readonly name: string;
  /**
   * PK for the GSI
   */
  public readonly pk: ResourceAttribute;
  /**
   * SK for the GSI
   */
  public readonly sk: ResourceAttribute;

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
