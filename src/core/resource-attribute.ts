import { paramCase } from "change-case";
import { Component } from "projen";
import { ValueOf } from "type-fest";
import { FractureService } from "./fracture-service";

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

export const ManagementType = {
  /**
   * Users are intended to edit this value.
   */
  USER_MANAGED: "USER_MANAGED",
  /**
   * This value is intended to be automatically managed by the system.
   */
  SYSTEM_MANAGED: "SYSTEM_MANAGED",
} as const;

export const IdentifierType = {
  /**
   * This attribute is an identifier for this resource.
   */
  PRIMARY: "PRIMARY",
  /**
   * Not used as an identifier
   */
  NONE: "NONE",
} as const;

export const VisabilityType = {
  /**
   * Value can appear in API input / output.
   */
  USER_VISIBLE: "USER_VISIBLE",
  /**
   * System value, not shown or visible to user.
   */
  HIDDEN: "HIDDEN",
} as const;

export type ResourceAttributeOptions = {
  /**
   * Full long name for this attribute.
   *
   * @example 'phone-number'
   */
  name: string;
  /**
   * Brief name used when storing data to save space.
   *
   * @example 'pn'
   * @default AttributeOptions.name
   */
  shortName?: string;
  /**
   * Comment lines to add to the Resource.
   *
   * @default []
   */
  comments?: Array<string>;
  /**
   * What is the type for tis attribute?
   *
   * @default ResourceAttributeType.STRING
   */
  type?: ValueOf<typeof ResourceAttributeType>;
  /**
   * Is this managed by the end user or the system?
   *
   * @default ManagementType.USER_MANAGED
   */
  management?: ValueOf<typeof ManagementType>;
  /**
   * Is this value visible to the end user?
   *
   * @default VisabilityType.USER_VISIBLE
   */
  visibility?: ValueOf<typeof VisabilityType>;
  /**
   * Is this value an identifier for this resource?
   *
   * @default IdentifierType.NONE
   */
  identifier?: ValueOf<typeof IdentifierType>;
  /**
   * The separator to use when composing this attribute from other attributes.
   *
   * @default: '#'
   */
  compositionsSeperator?: string;
  /**
   * The generator to use for all operations
   *
   * @default ResourceAttributeGenerator.NONE
   */
  generator?: ValueOf<typeof ResourceAttributeGenerator>;
  /**
   * The generator to use for create operations
   *
   * @default ResourceAttributeGenerator.NONE
   */
  createGenerator?: ValueOf<typeof ResourceAttributeGenerator>;
  /**
   * The generator to use for read operations
   *
   * @default ResourceAttributeGenerator.NONE
   */
  readGenerator?: ValueOf<typeof ResourceAttributeGenerator>;
  /**
   * The generator to use for update operations
   *
   * @default ResourceAttributeGenerator.NONE
   */
  updateGenerator?: ValueOf<typeof ResourceAttributeGenerator>;
  /**
   * The generator to use for delete operations
   *
   * @default ResourceAttributeGenerator.NONE
   */
  deleteGenerator?: ValueOf<typeof ResourceAttributeGenerator>;
  /**
   * The type for this attribute.
   * @default ResourceAttributeType.STRING
   */
  // type?: ValueOf<typeof ResourceAttributeType>;
  /**
   * Is this attribute required for all mutations?
   * @default false
   */
  // isRequired?: boolean;
  /**
   * Is this attribute publically accessible / visible?
   * @default true
   */
  // isPublic?: boolean;
  /**
   * Is this attribute expected to be managed exclusively by the system?
   * AKA: no outside inputs?
   *
   * @default false
   */
  // isSystem?: boolean;

  /**
   * What operations do we generate this attribute on?
   * @default false
   */
  // generateOn?: ValueOf<typeof OPERATION_SUB_TYPE>[];
  /**
   * What operations do we generate this attribute on?
   * @default false
   */
  // defaultOn?: OperationDefault[];
  /**
   * What operations do we output this attribute on?
   * @default false
   */
  // outputOn?: ValueOf<typeof OPERATION_SUB_TYPE>[];
  /**
   * Validations to run when creating this attribute.
   * @default []
   */
  // createValidations?: ValueOf<typeof ValidationRule>[];
  /**
   * Validations to run when reading data
   * @default []
   */
  // readValidations?: ValueOf<typeof ValidationRule>[];
  /**
   * Validations to run when updating this attribute.
   * @default []
   */
  // updateValidations?: ValueOf<typeof ValidationRule>[];
  /**
   * Validations to run when deleting this attribute.
   * @default []
   */
  // deleteValidations?: ValueOf<typeof ValidationRule>[];
  /**
   * Validations to run when importing external records.
   * @default []
   */
  // importValidations?: ValueOf<typeof ValidationRule>[];
  /**
   * Position this attribute should occupy when sorted.
   */
  // sortPosition?: number;
};

export class ResourceAttribute extends Component {
  /**
   * Full long name for this attribute.
   *
   * @example 'phone-number'
   */
  public readonly name: string;
  /**
   * Brief name used when storing data to save space.
   *
   * @example 'pn'
   * @default AttributeOptions.name
   */
  public readonly shortName: string;
  /**
   * Comment lines to add to the Resource.
   *
   * @default []
   */
  public comments: Array<string>;
  /**
   * What is the type for tis attribute?
   *
   * @default ResourceAttributeType.STRING
   */
  public readonly type: ValueOf<typeof ResourceAttributeType>;
  /**
   * Is this managed by the end user or the system?
   *
   * @default ManagementType.USER_MANAGED
   */
  public readonly management: ValueOf<typeof ManagementType>;
  /**
   * Is this value visible to the end user?
   *
   * @default VisabilityType.USER_VISIBLE
   */
  public readonly visibility: ValueOf<typeof VisabilityType>;
  /**
   * Is this value an identifier for this resource?
   *
   * @default IdentifierType.NONE
   */
  public readonly identifier: ValueOf<typeof IdentifierType>;
  /**
   * Is this attribute value composed of other attribute values?
   * If so they are stored in this array.
   *
   * @default[]
   */
  public readonly compositionSources: Array<ResourceAttribute> = [];
  /**
   * The separator to use when composing this attribute from other attributes.
   *
   * @default: '#'
   */
  public readonly compositionsSeperator: string;
  /**
   * The generator to use for create operations
   *
   * @default ResourceAttributeGenerator.NONE
   */
  public readonly createGenerator?: ValueOf<typeof ResourceAttributeGenerator>;
  /**
   * The generator to use for read operations
   *
   * @default ResourceAttributeGenerator.NONE
   */
  public readonly readGenerator?: ValueOf<typeof ResourceAttributeGenerator>;
  /**
   * The generator to use for update operations
   *
   * @default ResourceAttributeGenerator.NONE
   */
  public readonly updateGenerator?: ValueOf<typeof ResourceAttributeGenerator>;
  /**
   * The generator to use for delete operations
   *
   * @default ResourceAttributeGenerator.NONE
   */
  public readonly deleteGenerator?: ValueOf<typeof ResourceAttributeGenerator>;

  constructor(service: FractureService, options: ResourceAttributeOptions) {
    super(service);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = paramCase(options.name);
    this.shortName = options.shortName
      ? paramCase(options.shortName)
      : this.name;
    this.comments = options.comments ?? [];
    this.type = options.type ?? ResourceAttributeType.STRING;
    this.management = options.management ?? ManagementType.USER_MANAGED;
    this.visibility = options.visibility ?? VisabilityType.USER_VISIBLE;
    this.identifier = options.identifier ?? IdentifierType.NONE;
    this.compositionsSeperator = options.compositionsSeperator ?? "#";

    /***************************************************************************
     * Generators
     **************************************************************************/

    const defaultGenerator =
      options.generator ?? ResourceAttributeGenerator.NONE;
    this.createGenerator = options.createGenerator ?? defaultGenerator;
    this.readGenerator = options.readGenerator ?? defaultGenerator;
    this.updateGenerator = options.updateGenerator ?? defaultGenerator;
    this.deleteGenerator = options.deleteGenerator ?? defaultGenerator;

    return this;
  }

  public addCompositionSource(a: ResourceAttribute) {
    if (this.createGenerator !== ResourceAttributeGenerator.COMPOSITION) {
      throw new Error(
        "Cannot add composition source to non-composed attribute."
      );
    }
    this.compositionSources.push(a);
  }

  /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     * Pull our service defaults, add a default comment if none are otherwise
     * given, and establish a default keyAccessPattern for storing data in
     * DynamoDB.
     *

    **************************************************************************/

  /*s
    const defaultOptions: Partial<ResourceAttributeOptions> = {
      comments: [`A ${options.name}.`],
      type: ResourceAttributeType.STRING,
      isRequired: false,
      isPublic: true,
      isSystem: false,
      generator: ResourceAttributeGenerator.NONE,
      generateOn: [],
      defaultOn: [],
      outputOn: [],
      createValidations: [],
      readValidations: [],
      updateValidations: [],
      deleteValidations: [],
      importValidations: [],
      sortPosition: resource.attributes.length,
      compositionsSeperator: resource.options.compositionsSeperator,
    };
    */

  /***************************************************************************
   *
   * INIT RESOURCE
   *
   **************************************************************************/

  // if it's not generated, we need to validate type
  // if (!this.isGenerated) {
  //   this.options.createValidations.push(ValidationRule.TYPE);
  //   this.options.readValidations.push(ValidationRule.TYPE);
  //   this.options.updateValidations.push(ValidationRule.TYPE);
  //   this.options.deleteValidations.push(ValidationRule.TYPE);
  //   this.options.importValidations.push(ValidationRule.TYPE);
  // }

  // // if it's required, we need to validate as resuired
  // if (this.options.isRequired) {
  //   this.options.createValidations.unshift(ValidationRule.REQUIRED);
  //   this.options.readValidations.unshift(ValidationRule.REQUIRED);
  //   this.options.updateValidations.unshift(ValidationRule.REQUIRED);
  //   this.options.deleteValidations.unshift(ValidationRule.REQUIRED);
  //   this.options.importValidations.unshift(ValidationRule.REQUIRED);
  // }

  // // decorate comments as needed type
  // if (this.options.type === ResourceAttributeType.GUID) {
  //   this.options.comments.push(`@type A GUID string.`);
  // }

  // it's generated
  // if (this.isGenerated) {
  //   this.options.comments.push(
  //     `@readonly This attribute is managed automatically by the system.`
  //   );
  // }

  /***************************************************************************
   *
   * GENERATORS
   *
   **************************************************************************/

  // this.ts = new TypescriptResourceAttribute(this);

  /*****************************************************************************
   *
   * ACCESSORS
   *
   ****************************************************************************/

  // public get isRequired(): boolean {
  //   return this.options.isRequired;
  // }

  // public get name(): string {
  //   return this.options.name;
  // }

  // public get shortName(): string {
  //   return this.options.shortName;
  // }

  // public get comments(): string[] {
  //   return this.options.comments;
  // }

  // public get type(): ValueOf<typeof ResourceAttributeType> {
  //   return this.options.type;
  // }

  // public get isSystem(): boolean {
  //   return this.options.isSystem;
  // }

  // public get sortPosition(): number {
  //   const boost = this.isAccessPatternKey ? 1000 : 0;
  //   return this.options.sortPosition + boost;
  // }

  // public get generateOn(): ValueOf<typeof OPERATION_SUB_TYPE>[] {
  //   return this.options.generateOn;
  // }

  // public get defaultOn(): OperationDefault[] {
  //   return this.options.defaultOn;
  // }

  // public get outputOn(): ValueOf<typeof OPERATION_SUB_TYPE>[] {
  //   return this.options.outputOn;
  // }

  // public get compositionsSeperator() {
  //   return this.options.compositionsSeperator;
  // }

  // /*****************************************************************************
  //  *
  //  * PK and SK HELPERS
  //  *
  //  ****************************************************************************/

  // /**
  //  * Is involved in PK or SK in any way
  //  */
  // public get isKeyPart(): boolean {
  //   return (
  //     this.isPartitionKey ||
  //     this.isSortKey ||
  //     this.isPartitionKeySource ||
  //     this.isSortKeySource
  //   );
  // }

  // public get isPartitionKey(): boolean {
  //   return this.resource.partitionKey === this;
  // }

  // public get isSortKey(): boolean {
  //   return this.resource.sortKey === this;
  // }

  // /**
  //  * Is this key park of an access pattern?
  //  */
  // public get isAccessPatternKey(): boolean {
  //   return this.resource.accessPatterns.some((accessPattern) => {
  //     return (
  //       accessPattern.pkAttribute.name === this.name ||
  //       accessPattern.skAttribute.name === this.name
  //     );
  //   });
  // }

  // /**
  //  * Is this attribute a pk or sk? If so, it's required in all operations
  //  */
  // public get isRequiredAccessPatternKey(): boolean {
  //   return this.isPartitionKey || this.isSortKey;
  // }

  // /**
  //  * All other access pattern keys that are not the pk or sk are optional.
  //  * Is Access Pattern Key
  //  * Is not the SK or SK
  //  */
  // public get isOptionalAccessPatternKey(): boolean {
  //   return !this.isRequiredAccessPatternKey;
  // }

  // /*****************************************************************************
  //  *
  //  *  PUBLIC vs PRIVATE
  //  *
  //  ****************************************************************************/

  // public get isPublic(): boolean {
  //   return this.options.isPublic;
  // }

  // public get isPrivate(): boolean {
  //   return !this.isPublic;
  // }

  // /*****************************************************************************
  //  *
  //  *  ACCESS PATTERN HELPERS
  //  *
  //  ****************************************************************************/

  // public get isPartitionKeySource(): boolean {
  //   return this.keyAccessPattern.pkAttribute.compositionSources.some(
  //     (source) => {
  //       return source.name === this.name;
  //     }
  //   );
  // }

  // public get isSortKeySource(): boolean {
  //   return this.keyAccessPattern.skAttribute.compositionSources.some(
  //     (source) => {
  //       return source.name === this.name;
  //     }
  //   );
  // }

  // public get keyAccessPattern(): AccessPattern {
  //   return this.resource.keyAccessPattern;
  // }

  // public get lookupAccessPattern(): AccessPattern {
  //   return this.resource.lookupAccessPattern;
  // }

  // /*****************************************************************************
  //  *
  //  *  GENERATOR HELPERS
  //  *
  //  ****************************************************************************/

  // public get isGenerated(): boolean {
  //   return this.generator !== ResourceAttributeGenerator.NONE;
  // }

  // public get generator(): ValueOf<typeof ResourceAttributeGenerator> {
  //   return this.options.generator;
  // }

  // public isGeneratedOn(operation?: Operation): boolean {
  //   if (!operation) {
  //     return false;
  //   }

  //   return this.generateOn.some((g) => g === operation.operationSubType);
  // }

  // /*****************************************************************************
  //  *
  //  *  DEFAULT HELPERS
  //  *
  //  ****************************************************************************/

  // public hasDefaultFor(operation?: Operation): boolean {
  //   if (!operation) {
  //     return false;
  //   }
  //   return this.defaultOn.some(
  //     (d) => d.operationSubType === operation.operationSubType
  //   );
  // }

  // public defaultFor(operation?: Operation): string {
  //   if (!operation || !this.hasDefaultFor(operation)) {
  //     return "";
  //   }

  //   const foundDefault = this.defaultOn.find(
  //     (g) => g.operationSubType === operation.operationSubType
  //   );

  //   return foundDefault ? foundDefault.default : "";
  // }

  // /*****************************************************************************
  //  *
  //  *  OUTPUT HELPERS
  //  *
  //  ****************************************************************************/

  // public isOutputOn(operation?: Operation): boolean {
  //   if (this.outputOn.length === 0 || !operation) {
  //     return true;
  //   }
  //   return this.outputOn.some((g) => g === operation.operationSubType);
  // }

  // public get isData(): boolean {
  //   return this.generator === ResourceAttributeGenerator.NONE;
  // }

  // public get isAutoIncrementGenerator(): boolean {
  //   return (
  //     this.isGenerated &&
  //     this.generator === ResourceAttributeGenerator.AUTO_INCREMENT
  //   );
  // }

  // public get isGuidGenerator(): boolean {
  //   return (
  //     this.isGenerated && this.generator === ResourceAttributeGenerator.GUID
  //   );
  // }

  // public get isDateTimeGenerator(): boolean {
  //   return (
  //     this.isGenerated &&
  //     this.generator === ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP
  //   );
  // }

  // public get isTypeGenerator(): boolean {
  //   return (
  //     this.isGenerated && this.generator === ResourceAttributeGenerator.TYPE
  //   );
  // }

  // public get isVersionGenerator(): boolean {
  //   return (
  //     this.isGenerated &&
  //     this.generator === ResourceAttributeGenerator.VERSION_DATE_TIME_STAMP
  //   );
  // }

  // public get isComposableGenerator(): boolean {
  //   return (
  //     this.isGenerated &&
  //     this.generator === ResourceAttributeGenerator.COMPOSITION
  //   );
  // }

  // /*****************************************************************************
  //  *
  //  *  TYPESCRIPT HELPERS
  //  *
  //  ****************************************************************************/

  // public get tsAttributeName() {
  //   return formatStringByNamingStrategy(
  //     this.name,
  //     this.resource.namingStrategy.ts.attributeName
  //   );
  // }

  // public get tsAttributeShortName() {
  //   return formatStringByNamingStrategy(
  //     this.shortName,
  //     this.resource.namingStrategy.ts.attributeName
  //   );
  // }

  // public get tsRequired() {
  //   return this.isRequired ? "" : "?";
  // }

  // public get tsType() {
  //   switch (this.type) {
  //     case ResourceAttributeType.GUID:
  //     case ResourceAttributeType.STRING:
  //     case ResourceAttributeType.EMAIL:
  //     case ResourceAttributeType.PHONE:
  //     case ResourceAttributeType.URL:
  //     case ResourceAttributeType.DATE:
  //     case ResourceAttributeType.TIME:
  //     case ResourceAttributeType.DATE_TIME:
  //     case ResourceAttributeType.JSON:
  //     case ResourceAttributeType.IPADDRESS:
  //       return "string";
  //     case ResourceAttributeType.INT:
  //     case ResourceAttributeType.FLOAT:
  //     case ResourceAttributeType.TIMESTAMP:
  //     case ResourceAttributeType.COUNT:
  //     case ResourceAttributeType.AVERAGE:
  //     case ResourceAttributeType.SUM:
  //       return "number";
  //     case ResourceAttributeType.BOOLEAN:
  //       return "boolean";
  //     default:
  //       throw new Error(`Unknown attribute type: ${this.type}`);
  //   }
  // }

  // public getTsGenerationSource(operation: Operation) {
  //   const generator = this.generator;
  //   switch (generator) {
  //     case ResourceAttributeGenerator.NONE:
  //       throw new Error("No generator! Did you call isGenerated first?");
  //     case ResourceAttributeGenerator.GUID:
  //       return "uuidv4()";
  //     case ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP:
  //       return "new Date().toISOString()";
  //     case ResourceAttributeGenerator.TYPE:
  //       return `"${this.resource.name}"`;
  //     case ResourceAttributeGenerator.VERSION_DATE_TIME_STAMP:
  //       if (this.hasDefaultFor(operation)) {
  //         return `"${this.defaultFor(operation).toLowerCase()}"`;
  //       } else {
  //         return "new Date().toISOString()";
  //       }
  //     case ResourceAttributeGenerator.COMPOSITION:
  //       return this.compositionSources.length === 0
  //         ? undefined
  //         : this.compositionSources
  //             .map((s) => {
  //               return `${s.shortName}.toLowerCase()`;
  //             })
  //             .join(` + "${this.compositionsSeperator}" + `);
  //     default:
  //       throw new Error(`Unknown generator: ${generator}`);
  //   }
  // }
}
