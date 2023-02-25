import { paramCase, pascalCase } from "change-case";
import { ValueOf } from "type-fest";
import { Shape } from "./shape";
import { FractureComponent } from "../core/component";

/**
 * Each ShapeAttribute has a type that is used to determine how we will construct other generated code.
 */
export const ShapeAttributeType = {
  /**
   *  A unique identifier for an object. This scalar is serialized like a String but isn't meant to be human-readable.
   *  Long format GUID
   */
  GUID: "GUID",
  /**
   *  In GraphQL:   A UTF-8 character sequence.
   *  In DynamoDB:  Maximum DynamoDB item size limit of 400 KB (DynamoDB limit)
   *                When used as DynamoDB Key:
   *                  For a simple primary key, the maximum length of the first attribute value (the partition key) is 2048 bytes.
   *                  For a composite primary key, the maximum length of the second attribute value (the sort key) is 1024 bytes.
   */
  STRING: "String",
  /**
   *  In GraphQL:   An integer value between -(231) and 232-1.
   *  In DynamoDB:  Stored as Number
   *                Numbers can be positive, negative, or zero. Numbers can have up to 38 digits of precision.
   *                Exceeding this results in an exception.
   *                Positive range: 1E-130 to 9.9999999999999999999999999999999999999E+125
   *                Negative range: -9.9999999999999999999999999999999999999E+125 to -1E-130
   */
  INT: "Int",
  /**
   *  In GraphQL:   An IEEE 754 floating point value.
   *  In DynamoDB:  Stored as Number
   *                Numbers can be positive, negative, or zero. Numbers can have up to 38 digits of precision.
   *                Exceeding this results in an exception.
   *                Positive range: 1E-130 to 9.9999999999999999999999999999999999999E+125
   *                Negative range: -9.9999999999999999999999999999999999999E+125 to -1E-130
   */
  FLOAT: "Float",
  /**
   *  In GraphQL:   A Boolean value, either true or false.
   */
  BOOLEAN: "Boolean",
  /*****************************************************************************
   *
   *  APPSYNC TYPES
   *
   *  Additional data types which AppSync supports.
   *
   ****************************************************************************/
  /**
   *  GraphQL:  An extended ISO 8601 date string in the format YYYY-MM-DD.
   *  DynamoDB: Stored as string
   */
  DATE: "Date",
  /**
   *  GraphQL:  An extended ISO 8601 time string in the format hh:mm:ss.sss.
   *  DynamoDB: Stored as string
   */
  TIME: "Time",
  /**
   *  GraphQL:  An extended ISO 8601 date and time string in the format YYYY-MM-DDThh:mm:ss.sssZ.
   *  DynamoDB: Stored as string
   */
  DATE_TIME: "DateTime",
  /**
   *  GraphQl:  An integer value representing the number of seconds before or after 1970-01-01-T00:00Z.
   *  DynamoDB: Stored as Number
   */
  TIMESTAMP: "Timestamp",
  /**
   *  GraphQL:  An email address in the format local-part@domain-part as defined by RFC 822.
   *  DynamoDB: Stored as string
   */
  EMAIL: "Email",
  /**
   *  GraphQL:  A JSON string. Any valid JSON construct is automatically parsed and loaded in the resolver mapping
   *            templates as maps, lists, or scalar values rather than as the literal input strings. Unquoted strings or
   *            otherwise invalid JSON result in a GraphQL validation error.
   *  DynamoDB: Stored as ???
   */
  JSON: "JSON",
  /**
   *  GraphQL:  A phone number. Phone numbers can contain either spaces or hyphens to separate digit groups. Phone
   *            numbers without a country code are assumed to be US/North American numbers adhering to the
   *            North American Numbering Plan (NANP).
   *  DynamoDB: Stored as string
   */
  PHONE: "Phone",
  /**
   *  GraphQL:  A URL as defined by RFC 1738. For example, https://www.amazon.com/dp/B000NZW3KC/ or
   *            mailto:example@example.com. URLs must contain a schema (http, mailto) and can't contain two forward
   *            slashes (//) in the path part.
   *  DynamoDB: Stored as string
   */
  URL: "URL",
  /**
   *  GraphQL:  A valid IPv4 or IPv6 address. IPv4 addresses are expected in quad-dotted notation (123.12.34.56).
   *            IPv6 addresses are expected in non-bracketed, colon-separated format (1a2b:3c4b::1234:4567). You can
   *            include an optional CIDR suffix (123.45.67.89/16) to indicate subnet mask.
   *  DynamoDB: Stored as string
   */
  IPADDRESS: "IPAddress",
  /*****************************************************************************
   *
   *  FRACTURE TYPES
   *
   *  Special types used by Fracture. That are currently used primarily to store values calculated based on other
   *  attributes.
   *
   ****************************************************************************/
  COUNT: "Count",
  AVERAGE: "Average",
  SUM: "Sum",
} as const;

export const ShapeAttributeGenerator = {
  AUTO_INCREMENT: "Increment",
  GUID: "Guid",
  CURRENT_DATE_TIME_STAMP: "CurrentDateTimeStamp",
  TYPE: "Type",
  NONE: "None",
} as const;

export const ValidationRule = {
  REQUIRED: "Required",
  TYPE: "Type",
} as const;

export const DynamoDbType = {
  STRING: "S",
  NUMBER: "N",
  BINARY: "B",
  STRING_SET: "SS",
  NUMBER_SET: "NS",
  BINARY_SET: "BS",
  MAP: "M",
  LIST: "L",
  NULL: "NULL",
  BOOLEAN: "BOOL",
} as const;

export type ShapeAttributeOptions = {
  /**
   * Full long name for this attribute.
   * @example 'phone-number'
   */
  name: string;
  /**
   * Brief name used when storing data to save space.
   * @example 'pn'
   * @default ShapeAttributeOptions.name
   */
  shortName?: string;
  /**
   * Comment lines to add to the Shape.
   * @default []
   */
  comment?: string[];
  /**
   * The type for this attribute.
   * @default ShapeAttributeType.STRING
   */
  type?: ValueOf<typeof ShapeAttributeType>;
  /**
   * Is this attribute a key for the Shape?
   * @default false
   */
  isKey?: boolean;
  /**
   * Is this attribute a key for data sources form a remote system?
   * @default false
   */
  isRemoteKey?: boolean;
  /**
   * Is this attribute sourced from remote imported data only?
   * If true, cannot be edited by local system.
   * @default false
   */
  isRemoteField?: boolean;
  /**
   * Is this attribute required for all mutations?
   * @default false
   */
  isRequired?: boolean;
  /**
   * The generator to use for this attribute when creating it.
   * @default ShapeAttributeGenerator.NONE
   */
  createGenerator?: ValueOf<typeof ShapeAttributeGenerator>;
  /**
   * The generator to use for this attribute when updating it.
   * @default ShapeAttributeGenerator.NONE
   */
  updateGenerator?: ValueOf<typeof ShapeAttributeGenerator>;
  /**
   * The generator to use for this attribute when deleting it.
   * @default ShapeAttributeGenerator.NONE
   */
  deleteGenerator?: ValueOf<typeof ShapeAttributeGenerator>;
  /**
   * Validations to run when creating this attribute.
   * @default []
   */
  createValidations?: ValueOf<typeof ValidationRule>[];
  /**
   * Validations to run when updating this attribute.
   * @default []
   */
  updateValidations?: ValueOf<typeof ValidationRule>[];
  /**
   * Validations to run when deleting this attribute.
   * @default []
   */
  deleteValidations?: ValueOf<typeof ValidationRule>[];
};

export class ShapeAttribute extends FractureComponent {
  public readonly shape: Shape;
  public readonly name: string;
  public readonly shortName: string;
  private readonly _comment: string[];
  public readonly type: ValueOf<typeof ShapeAttributeType>;

  public readonly isKey: boolean;
  public readonly isRemoteKey: boolean;
  public readonly isRemoteField: boolean;
  public readonly isRequired: boolean;

  public readonly dynamoDbType: ValueOf<typeof DynamoDbType>;
  public readonly typeScriptType: string;
  public readonly createGenerator: ValueOf<typeof ShapeAttributeGenerator>;
  public readonly updateGenerator: ValueOf<typeof ShapeAttributeGenerator>;
  public readonly deleteGenerator: ValueOf<typeof ShapeAttributeGenerator>;

  public readonly createValidations: ValueOf<typeof ValidationRule>[];
  public readonly updateValidations: ValueOf<typeof ValidationRule>[];
  public readonly deleteValidations: ValueOf<typeof ValidationRule>[];

  /**
   * This value is managed automatically and cannot be set using outside
   * interfaces. This is useful for fields which are automatically generated.
   */
  public readonly isSystem: boolean;
  /*
  public readonly isData: boolean;
  public readonly isCreateInput: boolean;
  public readonly isReadInput: boolean;
  public readonly isUpdateInput: boolean;
  public readonly isDeleteInput: boolean;
  public readonly isListInput: boolean;
  public readonly isImportInput: boolean;
  */

  constructor(shape: Shape, options: ShapeAttributeOptions) {
    super(shape.fracture);

    this.shape = shape;
    this.name = paramCase(options.name);
    this.shortName = options.shortName
      ? pascalCase(options.shortName).toLowerCase()
      : pascalCase(options.name).toLowerCase();
    this._comment = options.comment ?? [`A ${this.name}.`];
    this.type = options.type ?? ShapeAttributeType.STRING;
    this.isKey = options.isKey ?? false;
    this.isRemoteKey = options.isRemoteKey ?? false;
    this.isRemoteField =
      (options.isRemoteField || options.isRemoteKey) ?? false;
    this.isRequired =
      (options.isRequired || options.isKey || options.isRemoteKey) ?? false;

    // dynamo types
    switch (this.type) {
      case ShapeAttributeType.GUID:
      case ShapeAttributeType.STRING:
      case ShapeAttributeType.EMAIL:
      case ShapeAttributeType.PHONE:
      case ShapeAttributeType.URL:
      case ShapeAttributeType.DATE:
      case ShapeAttributeType.TIME:
      case ShapeAttributeType.DATE_TIME:
      case ShapeAttributeType.JSON:
      case ShapeAttributeType.IPADDRESS:
        this.dynamoDbType = DynamoDbType.STRING;
        this.typeScriptType = "string";
        break;
      case ShapeAttributeType.INT:
      case ShapeAttributeType.FLOAT:
      case ShapeAttributeType.TIMESTAMP:
      case ShapeAttributeType.COUNT:
      case ShapeAttributeType.AVERAGE:
      case ShapeAttributeType.SUM:
        this.dynamoDbType = DynamoDbType.NUMBER;
        this.typeScriptType = "number";
        break;
      case ShapeAttributeType.BOOLEAN:
        this.dynamoDbType = DynamoDbType.BOOLEAN;
        this.typeScriptType = "boolean";
        break;
      default:
        throw new Error(`Unknown attribute type: ${this.type}`);
    }

    // deterine generators
    this.createGenerator =
      options.createGenerator ?? ShapeAttributeGenerator.NONE;
    this.updateGenerator =
      options.updateGenerator ?? ShapeAttributeGenerator.NONE;
    this.deleteGenerator =
      options.deleteGenerator ?? ShapeAttributeGenerator.NONE;

    // determine if this is a system managed attribute.
    this.isSystem =
      this.createGenerator !== ShapeAttributeGenerator.NONE ||
      this.updateGenerator !== ShapeAttributeGenerator.NONE ||
      this.deleteGenerator !== ShapeAttributeGenerator.NONE;

    // setup validation rules
    this.createValidations = options.createValidations ?? [];
    this.updateValidations = options.updateValidations ?? [];
    this.deleteValidations = options.deleteValidations ?? [];

    // validate type for all non-system managed values
    if (!this.isSystem) {
      this.createValidations.push(ValidationRule.TYPE);
      this.updateValidations.push(ValidationRule.TYPE);
      this.deleteValidations.push(ValidationRule.TYPE);
    }

    // add required validation if required field. make sure it's the first item in the array.
    if (this.isRequired) {
      this.createValidations.unshift(ValidationRule.REQUIRED);
      this.updateValidations.unshift(ValidationRule.REQUIRED);
      this.deleteValidations.unshift(ValidationRule.REQUIRED);
    }
  }

  public get isData(): boolean {
    return !this.isSystem && !this.isKey && !this.isRemoteField;
  }
  public get isCreateInput(): boolean {
    return !this.isSystem && !this.isKey && !this.isRemoteField;
  }
  public get isReadInput(): boolean {
    return this.isKey;
  }
  public get isUpdateInput(): boolean {
    return !this.isSystem && !this.isRemoteField;
  }
  public get isDeleteInput(): boolean {
    return this.isKey;
  }
  public get isListInput(): boolean {
    return false;
  }
  public get isImportInput(): boolean {
    return !this.isSystem || this.isRemoteField;
  }

  /**
   * Get comment lines.
   */
  public get comment(): string[] {
    const c = [...this._comment];

    // attribute type
    if (this.type === ShapeAttributeType.GUID) {
      c.push(`@type A GUID string.`);
    }

    // it's sytem managed
    if (this.isSystem) {
      c.push(
        `@readonly This attribute is managed automatically by the system.`
      );
    }

    return c;
  }
}
