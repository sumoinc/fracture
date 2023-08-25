import { paramCase } from "change-case";
import { Component } from "projen";
import { ValueOf } from "type-fest";
import { FractureService } from "../core";

export const AttributeType = {
  STRING: "S",
} as const;

export const KeyType = {
  HASH: "HASH",
  RANGE: "RANGE",
  NONE: "NONE",
} as const;

export type DynamoAttributeOptions = {
  /**
   * Full long name for this attribute.
   *
   * @example 'phone-number'
   */
  name: string;
  /**
   * DynamoType for this attribute.
   *
   * @default AttributeType.STRING
   */
  attributeType?: ValueOf<typeof AttributeType>;
  /**
   * If attribute is a key, what type of key is it?
   *
   * @default KeyType.NONE
   */
  keyType?: ValueOf<typeof KeyType>;
};

export class DynamoAttribute extends Component {
  /**
   * Name for this attribute.
   *
   * @example 'pk'
   */
  public readonly name: string;
  /**
   * Dynamo type for this attribute.
   *
   * @default AttributeType.STRING
   */
  public readonly attributeType: ValueOf<typeof AttributeType>;
  /**
   * If attribute is a key, what type of key is it?
   *
   * @default KeyType.NONE
   */
  public readonly keyType: ValueOf<typeof KeyType>;

  constructor(service: FractureService, options: DynamoAttributeOptions) {
    super(service);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = paramCase(options.name);
    this.attributeType = options.attributeType ?? AttributeType.STRING;
    this.keyType = options.keyType ?? KeyType.NONE;
    return this;
  }
}
