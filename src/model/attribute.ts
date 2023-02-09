import { paramCase } from 'change-case';
import { Project } from 'projen';
import { ValueOf } from 'type-fest';
import { FractureComponent } from '../component';

export const AttributeType = {
  /*****************************************************************************
   *
   *  GRAPHQL TYPES
   *
   *  Basic data types supported by plain vanilla GraphQL.
   *
   ****************************************************************************/
  /**
   *  A unique identifier for an object. This scalar is serialized like a String but isn't meant to be human-readable.
   *  Long format UUID
   */
  ID: 'ID',
  /**
   *  In GraphQL:   A UTF-8 character sequence.
   *  In DynamoDB:  Maximum DynamoDB item size limit of 400 KB (DynamoDB limit)
   *                When used as DynamoDB Key:
   *                  For a simple primary key, the maximum length of the first attribute value (the partition key) is 2048 bytes.
   *                  For a composite primary key, the maximum length of the second attribute value (the sort key) is 1024 bytes.
   */
  STRING: 'String',
  /**
   *  In GraphQL:   An integer value between -(231) and 232-1.
   *  In DynamoDB:  Stored as Number
   *                Numbers can be positive, negative, or zero. Numbers can have up to 38 digits of precision.
   *                Exceeding this results in an exception.
   *                Positive range: 1E-130 to 9.9999999999999999999999999999999999999E+125
   *                Negative range: -9.9999999999999999999999999999999999999E+125 to -1E-130
   */
  INT: 'Int',
  /**
   *  In GraphQL:   An IEEE 754 floating point value.
   *  In DynamoDB:  Stored as Number
   *                Numbers can be positive, negative, or zero. Numbers can have up to 38 digits of precision.
   *                Exceeding this results in an exception.
   *                Positive range: 1E-130 to 9.9999999999999999999999999999999999999E+125
   *                Negative range: -9.9999999999999999999999999999999999999E+125 to -1E-130
   */
  FLOAT: 'Float',
  /**
   *  In GraphQL:   A Boolean value, either true or false.
   */
  BOOLEAN: 'Boolean',
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
  DATE: 'Date',
  /**
   *  GraphQL:  An extended ISO 8601 time string in the format hh:mm:ss.sss.
   *  DynamoDB: Stored as string
   */
  TIME: 'Time',
  /**
   *  GraphQL:  An extended ISO 8601 date and time string in the format YYYY-MM-DDThh:mm:ss.sssZ.
   *  DynamoDB: Stored as string
   */
  DATE_TIME: 'DateTime',
  /**
   *  GraphQl:  An integer value representing the number of seconds before or after 1970-01-01-T00:00Z.
   *  DynamoDB: Stored as Number
   */
  TIMESTAMP: 'Timestamp',
  /**
   *  GraphQL:  An email address in the format local-part@domain-part as defined by RFC 822.
   *  DynamoDB: Stored as string
   */
  EMAIL: 'Email',
  /**
   *  GraphQL:  A JSON string. Any valid JSON construct is automatically parsed and loaded in the resolver mapping
   *            templates as maps, lists, or scalar values rather than as the literal input strings. Unquoted strings or
   *            otherwise invalid JSON result in a GraphQL validation error.
   *  DynamoDB: Stored as ???
   */
  JSON: 'JSON',
  /**
   *  GraphQL:  A phone number. Phone numbers can contain either spaces or hyphens to separate digit groups. Phone
   *            numbers without a country code are assumed to be US/North American numbers adhering to the
   *            North American Numbering Plan (NANP).
   *  DynamoDB: Stored as string
   */
  PHONE: 'Phone',
  /**
   *  GraphQL:  A URL as defined by RFC 1738. For example, https://www.amazon.com/dp/B000NZW3KC/ or
   *            mailto:example@example.com. URLs must contain a schema (http, mailto) and can't contain two forward
   *            slashes (//) in the path part.
   *  DynamoDB: Stored as string
   */
  URL: 'URL',
  /**
   *  GraphQL:  A valid IPv4 or IPv6 address. IPv4 addresses are expected in quad-dotted notation (123.12.34.56).
   *            IPv6 addresses are expected in non-bracketed, colon-separated format (1a2b:3c4b::1234:4567). You can
   *            include an optional CIDR suffix (123.45.67.89/16) to indicate subnet mask.
   *  DynamoDB: Stored as string
   */
  IPADDRESS: 'IPAddress',
  /*****************************************************************************
   *
   *  FRACTURE TYPES
   *
   *  Special types used by Fracture. That are currently used primarily to store values calculated based on other
   *  attributes.
   *
   ****************************************************************************/
  COUNT: 'Count',
  AVERAGE: 'Average',
  SUM: 'Sum',
} as const;

export const AttributeGenerator = {
  AUTO_INCREMENT: 'Increment',
  GUID: 'Guid',
  DATE_TIME_STAMP: 'DateTimeStamp',
  VERSION: 'Version',
  VERSION_EXP: 'Ttl',
  TYPE: 'Type',
  NONE: 'None',
} as const;

export const DynamoDbType = {
  STRING: 'S',
  NUMBER: 'N',
  BINARY: 'B',
  STRING_SET: 'SS',
  NUMBER_SET: 'NS',
  BINARY_SET: 'BS',
  MAP: 'M',
  LIST: 'L',
  NULL: 'NULL',
  BOOLEAN: 'BOOL',
} as const;

export type AttributeOptions = {
  /**
   *  Full long name for this attribute.
   *
   *  eg: 'phone-number'
   *
   */
  name: string;
  /**
   *  Brief name used when storing data to save space.
   *
   *  eg: 'pn'
   *
   */
  shortName?: string;
  /**
   *  The type for this attribute.
   */
  type?: ValueOf<typeof AttributeType>;
  /**
   *  The type for this attribute.
   */
  dynamoDbType?: ValueOf<typeof DynamoDbType>;
};


export class Attribute extends FractureComponent {
  public readonly name: string;
  public readonly shortName: string;
  public readonly type: ValueOf<typeof AttributeType>;
  public readonly dynamoDbType: ValueOf<typeof DynamoDbType>;

  constructor(
    project: Project,
    namespace: string,
    options: AttributeOptions,
  ) {
    super(project, namespace);

    this.name = paramCase(options.name);
    this.shortName = options.shortName ? paramCase(options.shortName) : this.name;
    this.type = options.type ?? AttributeType.STRING;

    // dynamo types
    switch (this.type) {
      case AttributeType.ID:
      case AttributeType.STRING:
      case AttributeType.EMAIL:
      case AttributeType.PHONE:
      case AttributeType.URL:
      case AttributeType.DATE:
      case AttributeType.TIME:
      case AttributeType.DATE_TIME:
      case AttributeType.JSON:
      case AttributeType.IPADDRESS:
        this.dynamoDbType = DynamoDbType.STRING;
        break;
      case AttributeType.INT:
      case AttributeType.FLOAT:
      case AttributeType.TIMESTAMP:
      case AttributeType.COUNT:
      case AttributeType.AVERAGE:
      case AttributeType.SUM:
        this.dynamoDbType = DynamoDbType.NUMBER;
        break;
      case AttributeType.BOOLEAN:
        this.dynamoDbType = DynamoDbType.BOOLEAN;
        break;
      default:
        throw new Error(`Unknown attribute type: ${this.type}`);
    }

  }

}
