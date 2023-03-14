import { paramCase } from "change-case";
import { deepMerge } from "projen/lib/util";
import { ValueOf } from "type-fest";
import { FractureComponent } from ".";
import { AccessPattern } from "./access-pattern";
import { Operation, OPERATION_SUB_TYPE } from "./operation";

import { Resource } from "./resource";

/**
 * Each Attribute has a type that is used to determine how we will construct other generated code.
 */
export const ResourceAttributeType = {
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

export const ResourceAttributeGenerator = {
  AUTO_INCREMENT: "Increment",
  GUID: "Guid",
  CURRENT_DATE_TIME_STAMP: "CurrentDateTimeStamp",
  TYPE: "Type",
  NONE: "None",
  VERSION_DATE_TIME_STAMP: "VersionDateTimeStamp",
  /**
   * Composed of other attributes
   */
  COMPOSITION: "Composition",
} as const;

export const ValidationRule = {
  REQUIRED: "Required",
  TYPE: "Type",
} as const;

export type ResourceAttributeOptions = {
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
   * @default ResourceAttributeType.STRING
   */
  type?: ValueOf<typeof ResourceAttributeType>;
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
   * The generator to use to build this attribute.
   * @default ResourceAttributeGenerator.NONE
   */
  generator?: ValueOf<typeof ResourceAttributeGenerator>;
  /**
   * What operations do we generate this attribute on?
   * @default false
   */
  generateOn?: ValueOf<typeof OPERATION_SUB_TYPE>[];
  /**
   * What operations do we generate this attribute on?
   * @default false
   */
  defaultOn?: {
    operationSubType: ValueOf<typeof OPERATION_SUB_TYPE>;
    default: any;
  }[];
  /**
   * What operations do we output this attribute on?
   * @default false
   */
  outputOn?: ValueOf<typeof OPERATION_SUB_TYPE>[];
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

export class ResourceAttribute extends FractureComponent {
  // member components
  public readonly compositionSources: ResourceAttribute[] = [];
  // parent
  public readonly resource: Resource;
  // all other options
  public readonly options: Required<ResourceAttributeOptions>;

  constructor(resource: Resource, options: ResourceAttributeOptions) {
    super(resource.fracture);

    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     * Pull our service defaults, add a default comment if none are otherwise
     * given, and establish a default keyAccessPattern for storing data in
     * DynamoDB.
     *
     **************************************************************************/

    const defaultOptions: Partial<ResourceAttributeOptions> = {
      comments: [`A ${options.name}.`],
      type: ResourceAttributeType.STRING,
      isRequired: false,
      isPublic: true,
      generator: ResourceAttributeGenerator.NONE,
      generateOn: [],
      defaultOn: [],
      outputOn: [
        OPERATION_SUB_TYPE.CREATE_ONE,
        OPERATION_SUB_TYPE.READ_ONE,
        OPERATION_SUB_TYPE.UPDATE_ONE,
        OPERATION_SUB_TYPE.DELETE_ONE,
      ],
      createValidations: [],
      readValidations: [],
      updateValidations: [],
      deleteValidations: [],
      importValidations: [],
      sortPosition: resource.attributes.length,
      compositionSeperator: resource.options.compositionSeperator,
    };

    /***************************************************************************
     *
     * INIT RESOURCE
     *
     **************************************************************************/

    // member components

    // parent + inverse
    this.resource = resource;
    resource.attributes.push(this);

    // ensure names are param-cased
    const forcedOptions: Partial<ResourceAttributeOptions> = {
      name: paramCase(options.name),
      shortName: options.shortName
        ? paramCase(options.shortName)
        : paramCase(options.name),
    };

    // all other options
    this.options = deepMerge([
      defaultOptions,
      JSON.parse(JSON.stringify(options)),
      forcedOptions,
    ]) as Required<ResourceAttributeOptions>;

    this.project.logger.info(`Attribute: "${this.name}" initialized.`);

    // if it's not generated, we need to validate type
    if (!this.isGenerated) {
      this.options.createValidations.push(ValidationRule.TYPE);
      this.options.readValidations.push(ValidationRule.TYPE);
      this.options.updateValidations.push(ValidationRule.TYPE);
      this.options.deleteValidations.push(ValidationRule.TYPE);
      this.options.importValidations.push(ValidationRule.TYPE);
    }

    // if it's required, we need to validate as resuired
    if (this.options.isRequired) {
      this.options.createValidations.unshift(ValidationRule.REQUIRED);
      this.options.readValidations.unshift(ValidationRule.REQUIRED);
      this.options.updateValidations.unshift(ValidationRule.REQUIRED);
      this.options.deleteValidations.unshift(ValidationRule.REQUIRED);
      this.options.importValidations.unshift(ValidationRule.REQUIRED);
    }

    // decorate comments as needed type
    if (this.options.type === ResourceAttributeType.GUID) {
      this.options.comments.push(`@type A GUID string.`);
    }

    // it's generated
    if (this.isGenerated) {
      this.options.comments.push(
        `@readonly This attribute is managed automatically by the system.`
      );
    }

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

  public get comments(): string[] {
    return this.options.comments;
  }

  public get type(): ValueOf<typeof ResourceAttributeType> {
    return this.options.type;
  }

  public get sortPosition(): number {
    const boost = this.isAccessPatternKey ? 1000 : 0;
    return this.options.sortPosition + boost;
  }

  public get generateOn(): ValueOf<typeof OPERATION_SUB_TYPE>[] {
    return this.options.generateOn;
  }

  public get outputOn(): ValueOf<typeof OPERATION_SUB_TYPE>[] {
    return this.options.outputOn;
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

  public get isPkSource(): boolean {
    return this.keyAccessPattern.pkAttribute.compositionSources.some(
      (source) => {
        return source.name === this.name;
      }
    );
  }

  public get isSkSource(): boolean {
    return this.keyAccessPattern.skAttribute.compositionSources.some(
      (source) => {
        return source.name === this.name;
      }
    );
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
    return this.options.generator !== ResourceAttributeGenerator.NONE;
  }

  public get generator(): ValueOf<typeof ResourceAttributeGenerator> {
    return this.options.generator;
  }

  public isGeneratedOn(operation?: Operation): boolean {
    if (!operation) {
      return false;
    }

    return this.generateOn.some((g) => g === operation.operationSubType);
  }

  public isOutputOn(operation?: Operation): boolean {
    if (this.outputOn.length === 0 || !operation) {
      return true;
    }
    return this.outputOn.some((g) => g === operation.operationSubType);
  }

  public get isData(): boolean {
    return this.options.generator === ResourceAttributeGenerator.NONE;
  }

  public get isAutoIncrementGenerator(): boolean {
    return (
      this.isGenerated &&
      this.generator === ResourceAttributeGenerator.AUTO_INCREMENT
    );
  }

  public get isGuidGenerator(): boolean {
    return (
      this.isGenerated && this.generator === ResourceAttributeGenerator.GUID
    );
  }

  public get isDateTimeGenerator(): boolean {
    return (
      this.isGenerated &&
      this.generator === ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP
    );
  }

  public get isTypeGenerator(): boolean {
    return (
      this.isGenerated && this.generator === ResourceAttributeGenerator.TYPE
    );
  }

  public get isVersionGenerator(): boolean {
    return (
      this.isGenerated &&
      this.generator === ResourceAttributeGenerator.VERSION_DATE_TIME_STAMP
    );
  }

  public get isComposableGenerator(): boolean {
    return (
      this.isGenerated &&
      this.generator === ResourceAttributeGenerator.COMPOSITION
    );
  }
}
