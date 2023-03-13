import { ValueOf } from "type-fest";
import { AccessPattern } from "./access-pattern";
import { FractureComponent } from "./component";
import { Resource } from "./resource";
import { Service } from "./service";

/**
 * Each Attribute has a type that is used to determine how we will construct other generated code.
 */
export const AttributeType = {
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

export const AttributeGenerator = {
  AUTO_INCREMENT: "Increment",
  GUID: "Guid",
  CURRENT_DATE_TIME_STAMP: "CurrentDateTimeStamp",
  TYPE: "Type",
  NONE: "None",
  VERSION: "Version",
  /**
   * Composed of other attributes
   */
  COMPOSITION: "Composition",
} as const;

export const ValidationRule = {
  REQUIRED: "Required",
  TYPE: "Type",
} as const;

export type AttributeOptions = {
  /**
   * Full long name for this attribute.
   * @example 'phone-number'
   */
  name: string;
  /**
   * Brief name used when storing data to save space.
   * @example 'pn'
   * @default AttributeOptions.name
   */
  shortName?: string;
  /**
   * Comment lines to add to the Resource.
   * @default []
   */
  comments?: string[];
  /**
   * The type for this attribute.
   * @default AttributeType.STRING
   */
  type?: ValueOf<typeof AttributeType>;
  /**
   * Is this attribute required for all mutations?
   * @default false
   */
  isRequired?: boolean;
  /**
   * Is this attribute publically accessible / visible?
   * @default true
   */
  isPublic?: boolean;
  /**
   * Is this attribute used when building the PK?
   * @default false
   */
  isPkComponent?: boolean;
  /**
   * Is this attribute used when building the SK?
   * @default false
   */
  isSkComponent?: boolean;
  /**
   * Is this attribute used when lookuing up records?
   * @default false
   */
  isLookupComponent?: boolean;
  /**
   * The generator to use to build this attribute.
   * @default AttributeGenerator.NONE
   */
  generator?: ValueOf<typeof AttributeGenerator>;
  /**
   * Is this a attribute generated on create operations?
   * @default false
   */
  isGeneratedOnCreate?: boolean;
  /**
   * Is this a attribute generated on read operations?
   * @default false
   */
  isGeneratedOnRead?: boolean;
  /**
   * Is this a attribute generated on update operations?
   * @default false
   */
  isGeneratedOnUpdate?: boolean;
  /**
   * Is this a attribute generated on delete operations?
   * @default false
   */
  isGeneratedOnDelete?: boolean;
  /**
   * Validations to run when creating this attribute.
   * @default []
   */
  createValidations?: ValueOf<typeof ValidationRule>[];
  /**
   * Validations to run when reading data
   * @default []
   */
  readValidations?: ValueOf<typeof ValidationRule>[];
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
  /**
   * Validations to run when importing external records.
   * @default []
   */
  importValidations?: ValueOf<typeof ValidationRule>[];
  /**
   * Position this attribute should occupy when sorted.
   */
  sortPosition?: number;
  /**
   * The separator to use when composing this attribute from other attributes.
   * @default: '#'
   */
  compositionSeperator?: string;
};

export class Attribute extends FractureComponent {
  // member components
  public readonly compositionSources: Attribute[] = [];
  // parent
  public readonly resource: Resource;
  // all other options
  public readonly options: Required<AttributeOptions>;

  constructor(resource: Resource, options: Required<AttributeOptions>) {
    super(resource.fracture);
    this.resource = resource;
    this.options = options;
    return this;
  }

  /*****************************************************************************
   *
   * ACCESSORS
   *
   ****************************************************************************/

  public get isRequired(): boolean {
    return this.options.isRequired;
  }

  public get name(): string {
    return this.options.name;
  }

  public get shortName(): string {
    return this.options.shortName;
  }

  public get sortPosition(): number {
    const boost = this.isAccessPatternKey ? 1000 : 0;
    return this.options.sortPosition + boost;
  }

  /*****************************************************************************
   *
   * PK and SK HELPERS
   *
   ****************************************************************************/

  public get isPartitionKey(): boolean {
    return this.resource.partitionKey === this;
  }

  public get isSortKey(): boolean {
    return this.resource.sortKey === this;
  }

  /**
   * Is this key park of an access pattern?
   */
  public get isAccessPatternKey(): boolean {
    return this.resource.accessPatterns.some((accessPattern) => {
      return (
        accessPattern.pkAttribute.name === this.name ||
        accessPattern.skAttribute.name === this.name
      );
    });
  }

  /**
   * Is this attribute a pk or sk? If so, it's required in all operations
   */
  public get isRequiredAccessPatternKey(): boolean {
    return this.isPartitionKey || this.isSortKey;
  }

  /**
   * All other access pattern keys that are not the pk or sk are optional.
   * Is Access Pattern Key
   * Is not the SK or SK
   */
  public get isOptionalAccessPatternKey(): boolean {
    return !this.isRequiredAccessPatternKey;
  }

  /*****************************************************************************
   *
   *  PUBLIC vs PRIVATE
   *
   ****************************************************************************/

  public get isPublic(): boolean {
    return this.options.isPublic;
  }

  public get isPrivate(): boolean {
    return !this.isPublic;
  }

  /*****************************************************************************
   *
   *  ACCESS PATTERN HELPERS
   *
   ****************************************************************************/

  public get isPkComponent(): boolean {
    return this.options.isPkComponent;
  }

  public get isSkComponent(): boolean {
    return this.options.isSkComponent;
  }

  public get isLookupComponent(): boolean {
    return this.options.isLookupComponent;
  }

  public get keyAccessPattern(): AccessPattern {
    return this.resource.keyAccessPattern;
  }

  public get lookupAccessPattern(): AccessPattern {
    return this.resource.lookupAccessPattern;
  }

  /*****************************************************************************
   *
   *  GENERATOR HELPERS
   *
   ****************************************************************************/

  public get isGenerated(): boolean {
    return this.options.generator !== AttributeGenerator.NONE;
  }

  public get generator(): ValueOf<typeof AttributeGenerator> {
    return this.options.generator;
  }

  public get isGeneratedOnCreate(): boolean {
    return this.options.isGeneratedOnCreate;
  }

  public get isGeneratedOnRead(): boolean {
    return this.options.isGeneratedOnRead;
  }

  public get isGeneratedOnUpdate(): boolean {
    return this.options.isGeneratedOnUpdate;
  }

  public get isGeneratedOnDelete(): boolean {
    return this.options.isGeneratedOnDelete;
  }

  public get isData(): boolean {
    return this.options.generator === AttributeGenerator.NONE;
  }

  public get isAutoIncrementGenerator(): boolean {
    return (
      this.isGenerated && this.generator === AttributeGenerator.AUTO_INCREMENT
    );
  }

  public get isGuidGenerator(): boolean {
    return this.isGenerated && this.generator === AttributeGenerator.GUID;
  }

  public get isDateTimeGenerator(): boolean {
    return (
      this.isGenerated &&
      this.generator === AttributeGenerator.CURRENT_DATE_TIME_STAMP
    );
  }

  public get isTypeGenerator(): boolean {
    return this.isGenerated && this.generator === AttributeGenerator.TYPE;
  }

  public get isVersionGenerator(): boolean {
    return this.isGenerated && this.generator === AttributeGenerator.VERSION;
  }

  public get isComposableGenerator(): boolean {
    return (
      this.isGenerated && this.generator === AttributeGenerator.COMPOSITION
    );
  }

  /*****************************************************************************
   *
   *  UPSTREAM HELPERS
   *
   ****************************************************************************/

  public get service(): Service {
    return this.resource.service;
  }
}
