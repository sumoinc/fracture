import { paramCase } from "change-case";
import { deepMerge } from "projen/lib/util";
import {
  Attribute,
  AttributeGenerator,
  AttributeOptions,
  AttributeType,
  ValidationRule,
} from "./attribute";
import { Resource } from "./resource";
export interface ResourceAttributeOptions extends AttributeOptions {}

export class ResourceAttribute extends Attribute {
  // member components
  // parent
  public readonly resource: Resource;
  // all other options
  public readonly options: Required<ResourceAttributeOptions>;

  constructor(resource: Resource, options: ResourceAttributeOptions) {
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
      type: AttributeType.STRING,
      isRequired: false,
      isPublic: true,
      isPkComponent: false,
      isSkComponent: false,
      isLookupComponent: false,
      generator: AttributeGenerator.NONE,
      isGeneratedOnCreate: false,
      isGeneratedOnUpate: false,
      isGeneratedOnDelete: false,
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

    // ensure names are param-cased
    const forcedOptions: Partial<ResourceAttributeOptions> = {
      name: paramCase(options.name),
      shortName: options.shortName
        ? paramCase(options.shortName)
        : paramCase(options.name),
    };

    // all other options
    const mergedOptions = deepMerge([
      defaultOptions,
      JSON.parse(JSON.stringify(options)),
      forcedOptions,
    ]) as Required<ResourceAttributeOptions>;

    super(resource, mergedOptions);
    this.options = mergedOptions;
    this.resource = resource;
    resource.attributes.push(this);

    // is this attribute part of the pk or sk?
    if (this.isPkComponent) {
      this.resource.keyAccessPattern.addPkAttributeSource(this);
    }

    if (this.isSkComponent) {
      this.resource.keyAccessPattern.addSkAttributeSource(this);
    }

    // if this attribute is a lookup, add it to the lookup list
    if (this.isLookupComponent) {
      this.resource.lookupAccessPattern.addSkAttributeSource(this);
    }

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
    if (this.options.type === AttributeType.GUID) {
      this.options.comments.push(`@type A GUID string.`);
    }

    // it's generated
    if (this.isGenerated) {
      this.options.comments.push(
        `@readonly This attribute is managed automatically by the system.`
      );
    }

    // it's a lookup source
    if (this.options.isLookupComponent) {
      this.options.comments.push(
        `This attribute can be used as part of a lookup for this record.`
      );
    }
    return this;
  }
}
