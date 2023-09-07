import { paramCase } from "change-case";
import { Component } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { ValueOf } from "type-fest";
import { DynamoAttribute } from "./dynamo-attribute";

export const DynamoGsiType = {
  /**
   * The pk/sk GSI
   */
  PRIMARY: "PRIMARY",
  /**
   * all other GSI
   */
  SECONDARY: "SECONDARY",
} as const;

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
  /**
   * Type of GSI
   *
   * @default DynamoGsiType.SECONDARY
   */
  type?: ValueOf<typeof DynamoGsiType>;
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
  /**
   * Type of GSI
   *
   * @default DynamoGsiType.SECONDARY
   */
  public readonly type?: ValueOf<typeof DynamoGsiType>;

  constructor(
    public readonly project: TypeScriptProject,
    options: DynamoGsiOptions
  ) {
    super(project);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = paramCase(options.name);
    this.pk = options.pk;
    this.sk = options.sk;
    this.type = options.type ?? DynamoGsiType.SECONDARY;
  }
}
