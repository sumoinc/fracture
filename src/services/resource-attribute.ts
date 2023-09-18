import { paramCase } from "change-case";
import { Component } from "projen";
import { ValueOf } from "type-fest";
import { Resource } from "./resource";
import { Service } from "./service";

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
   *  RELATIONSHIP TYPES
   *
   ****************************************************************************/
  ARRAY: "Array",
  MAP: "Map",
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
  /**
   * Genrated based on Tenant ID from SaaS Identity
   */
  TENANT: "Tenant",
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
   * The resource this attribute belongs to
   */
  readonly resource: Resource;

  /**
   * Full long name for this attribute.
   *
   * @example 'phone-number'
   */
  readonly name: string;

  /**
   * Brief name used when storing data to save space.
   *
   * @example 'pn'
   * @default AttributeOptions.name
   */
  readonly shortName?: string;

  /**
   * Is this attribute required?
   *
   * @default true
   */
  readonly required?: boolean;

  /**
   * Comment lines to add to the Resource.
   *
   * @default []
   */
  readonly comments?: Array<string>;

  /**
   * What is the type for tis attribute?
   *
   * @default ResourceAttributeType.STRING
   */
  readonly type?: ValueOf<typeof ResourceAttributeType> | Resource;

  /**
   * Type parameter for this structure attribute.
   *
   * @default any
   * @example 'T' for MyType<T> generic
   * @example 'Foo' for Array<Foo>
   */
  readonly typeParameter?: string | Resource;

  /**
   * Is this managed by the end user or the system?
   *
   * @default ManagementType.USER_MANAGED
   */
  readonly management?: ValueOf<typeof ManagementType>;

  /**
   * Is this value visible to the end user?
   *
   * @default VisabilityType.USER_VISIBLE
   */
  readonly visibility?: ValueOf<typeof VisabilityType>;

  /**
   * Is this value an identifier for this resource?
   *
   * @default IdentifierType.NONE
   */
  readonly identifier?: ValueOf<typeof IdentifierType>;

  /**
   * The separator to use when composing this attribute from other attributes.
   *
   * @default '#'
   */
  readonly compositionsSeperator?: string;

  /**
   * The generator to use for all operations
   *
   * @default ResourceAttributeGenerator.NONE
   */
  readonly generator?: ValueOf<typeof ResourceAttributeGenerator>;

  /**
   * The generator to use for create operations
   *
   * @default ResourceAttributeGenerator.NONE
   */
  readonly createGenerator?: ValueOf<typeof ResourceAttributeGenerator>;

  /**
   * The generator to use for read operations
   *
   * @default ResourceAttributeGenerator.NONE
   */
  readonly readGenerator?: ValueOf<typeof ResourceAttributeGenerator>;

  /**
   * The generator to use for update operations
   *
   * @default ResourceAttributeGenerator.NONE
   */
  readonly updateGenerator?: ValueOf<typeof ResourceAttributeGenerator>;

  /**
   * The generator to use for delete operations
   *
   * @default ResourceAttributeGenerator.NONE
   */
  readonly deleteGenerator?: ValueOf<typeof ResourceAttributeGenerator>;
};

export class ResourceAttribute extends Component {
  /**
   * Returns an attribute by name, or undefined if it doesn't exist
   */
  public static byName(
    resource: Resource,
    name: string
  ): ResourceAttribute | undefined {
    const isDefined = (c: Component): c is ResourceAttribute =>
      c instanceof ResourceAttribute && c.name === name;
    return resource.attributes.find(isDefined);
  }

  /**
   * Returns an attribute by it's shortname, or undefined if it doesn't exist
   */
  public static byShortName(
    resource: Resource,
    shortName: string
  ): ResourceAttribute | undefined {
    const isDefined = (c: Component): c is ResourceAttribute =>
      c instanceof ResourceAttribute && c.shortName === shortName;
    return resource.attributes.find(isDefined);
  }

  /**
   * The resource this attribute belongs to
   */
  public readonly resource: Resource;

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
   * Is this attribute required?
   *
   * @default true
   */
  public readonly required: boolean;

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
  public readonly type: ValueOf<typeof ResourceAttributeType> | string;

  /**
   * Type parameter for this structure attribute.
   *
   * @default undefined
   * @example 'T' for MyType<T> generic
   * @example 'Foo' for Array<Foo>
   */
  public readonly typeParameter?: string;

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

  constructor(
    public readonly project: Service,
    options: ResourceAttributeOptions
  ) {
    super(project);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.resource = options.resource;
    this.name = paramCase(options.name);
    this.shortName = options.shortName
      ? paramCase(options.shortName)
      : this.name;
    this.required = options.required ?? true;
    this.comments = options.comments ?? [];
    this.type =
      options.type instanceof Resource
        ? options.type.name
        : !options.type
        ? ResourceAttributeType.STRING
        : options.type;
    this.typeParameter =
      options.typeParameter instanceof Resource
        ? options.typeParameter.name
        : options.typeParameter;
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

    /***************************************************************************
     * Add to Resource
     **************************************************************************/

    if (ResourceAttribute.byName(this.resource, this.name)) {
      throw new Error(
        `Resource "${this.resource.name}" already has an attribute named "${this.name}"`
      );
    }

    if (ResourceAttribute.byShortName(this.resource, this.shortName)) {
      throw new Error(
        `Resource "${this.resource.name}" already has an attribute with a shortname of "${this.shortName}"`
      );
    }

    this.resource.attributes.push(this);

    /***************************************************************************
     * Update primary resource structures
     **************************************************************************/

    // if visible, add to public data structure
    //if (this.visibility === VisabilityType.USER_VISIBLE) {
    this.resource.dataStructure.addAttribute({
      name: this.name,
      shortName: this.shortName,
      type: this.type,
      typeParameter: this.typeParameter,
      management: this.management,
      visibility: this.visibility,
      comments: this.comments,
      required: this.required,
    });
    //}

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
   * Configuration export for this attribute
   **************************************************************************/

  public config(): Record<string, any> {
    return {
      name: this.name,
      shortName: this.shortName,
      required: this.required,
      comments: this.comments,
      type: this.type,
      typeParameter: this.typeParameter,
      management: this.management,
      visibility: this.visibility,
      identifier: this.identifier,
      compositionSources: this.compositionSources.map((a) => a.name),
      compositionsSeperator: this.compositionsSeperator,
      createGenerator: this.createGenerator,
      readGenerator: this.readGenerator,
      updateGenerator: this.updateGenerator,
      deleteGenerator: this.deleteGenerator,
    };
  }
}
