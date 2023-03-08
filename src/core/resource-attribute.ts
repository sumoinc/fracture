import { paramCase } from "change-case";
import { deepMerge } from "projen/lib/util";
import { ValueOf } from "type-fest";
import { FractureComponent } from "./component";
import { Operation, OPERATION_SUB_TYPE } from "./operation";
import { Resource } from "./resource";
import { Service } from "./service";

/**
 * Each ResourceAttribute has a type that is used to determine how we will construct other generated code.
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
  VERSION: "Version",
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

export type ResourceAttributeOptions = {
  /**
   * Full long name for this attribute.
   * @example 'phone-number'
   */
  name: string;
  /**
   * Brief name used when storing data to save space.
   * @example 'pn'
   * @default ResourceAttributeOptions.name
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
   * The generator to use for this attribute when creating it.
   * @default ResourceAttributeGenerator.NONE
   */
  createGenerator?: ValueOf<typeof ResourceAttributeGenerator>;
  /**
   * The generator to use for this attribute when reading it.
   * @default ResourceAttributeGenerator.NONE
   */
  readGenerator?: ValueOf<typeof ResourceAttributeGenerator>;
  /**
   * The generator to use for this attribute when updating it.
   * @default ResourceAttributeGenerator.NONE
   */
  updateGenerator?: ValueOf<typeof ResourceAttributeGenerator>;
  /**
   * The generator to use for this attribute when deleting it.
   * @default ResourceAttributeGenerator.NONE
   */
  deleteGenerator?: ValueOf<typeof ResourceAttributeGenerator>;
  /**
   * The generator to use for this attribute when importing external records.
   * @default ResourceAttributeGenerator.NONE
   */
  importGenerator?: ValueOf<typeof ResourceAttributeGenerator>;
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
};

export class ResourceAttribute extends FractureComponent {
  // member components
  // parent
  public readonly resource: Resource;
  public readonly service: Service;
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
      createGenerator: ResourceAttributeGenerator.NONE,
      readGenerator: ResourceAttributeGenerator.NONE,
      updateGenerator: ResourceAttributeGenerator.NONE,
      deleteGenerator: ResourceAttributeGenerator.NONE,
      importGenerator: ResourceAttributeGenerator.NONE,
      createValidations: [],
      readValidations: [],
      updateValidations: [],
      deleteValidations: [],
      importValidations: [],
    };

    /***************************************************************************
     *
     * INIT RESOURCE
     *
     **************************************************************************/

    // member components

    // parent + inverse
    this.resource = resource;
    this.service = resource.service;
    this.resource.attributes.push(this);

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
      options,
      forcedOptions,
    ]) as Required<ResourceAttributeOptions>;

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
  }

  public get isPartitionKey(): boolean {
    return this.resource.keyAccessPattern.pkAttributes.some((a) => a === this);
  }
  public get isSortKey(): boolean {
    return this.resource.keyAccessPattern.skAttributes.some((a) => a === this);
  }

  public get isData(): boolean {
    return !this.isGenerated;
  }

  // generated fields
  public get isGenerated(): boolean {
    return (
      this.isCreateGenerated ||
      this.isReadGenerated ||
      this.isUpdateGenerated ||
      this.isDeleteGenerated
    );
  }
  public get isCreateGenerated(): boolean {
    return this.options.createGenerator !== ResourceAttributeGenerator.NONE;
  }
  public get isReadGenerated(): boolean {
    return this.options.readGenerator !== ResourceAttributeGenerator.NONE;
  }
  public get isUpdateGenerated(): boolean {
    return this.options.updateGenerator !== ResourceAttributeGenerator.NONE;
  }
  public get isDeleteGenerated(): boolean {
    return this.options.deleteGenerator !== ResourceAttributeGenerator.NONE;
  }
  public get isImportGenerated(): boolean {
    return this.options.importGenerator !== ResourceAttributeGenerator.NONE;
  }

  /**
   *
   * @param generator Does this attribute have a generator for this specific type?
   * @returns
   */
  public hasGenerator(
    generator: ValueOf<typeof ResourceAttributeGenerator>
  ): boolean {
    return (
      this.isGenerated &&
      (this.hasCreateGenerator(generator) ||
        this.hasReadGenerator(generator) ||
        this.hasUpdateGenerator(generator) ||
        this.hasDeleteGenerator(generator))
    );
  }
  public hasCreateGenerator(
    generator: ValueOf<typeof ResourceAttributeGenerator>
  ): boolean {
    return this.isCreateGenerated && this.options.createGenerator === generator;
  }
  public hasReadGenerator(
    generator: ValueOf<typeof ResourceAttributeGenerator>
  ): boolean {
    return this.isReadGenerated && this.options.readGenerator === generator;
  }
  public hasUpdateGenerator(
    generator: ValueOf<typeof ResourceAttributeGenerator>
  ): boolean {
    return this.isUpdateGenerated && this.options.updateGenerator === generator;
  }
  public hasDeleteGenerator(
    generator: ValueOf<typeof ResourceAttributeGenerator>
  ): boolean {
    return this.isDeleteGenerated && this.options.deleteGenerator === generator;
  }

  public generatorForOperation(operation: Operation) {
    switch (operation.options.operationSubType) {
      case OPERATION_SUB_TYPE.CREATE_ONE:
        return this.options.createGenerator;
      case OPERATION_SUB_TYPE.READ_ONE:
        return this.options.readGenerator;
      case OPERATION_SUB_TYPE.UPDATE_ONE:
        return this.options.updateGenerator;
      case OPERATION_SUB_TYPE.DELETE_ONE:
        return this.options.deleteGenerator;
      case OPERATION_SUB_TYPE.IMPORT_ONE:
        return this.options.importGenerator;
      default:
        throw new Error(`Unknown sub-operation: ${operation}`);
    }
  }
}
