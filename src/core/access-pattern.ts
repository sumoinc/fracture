import { paramCase } from "change-case";
import { deepMerge } from "projen/lib/util";
import { Resource } from "./resource";
import {
  ResourceAttribute,
  ResourceAttributeGenerator,
  ResourceAttributeOptions,
} from "./resource-attribute";
import { FractureComponent } from "../core/component";
import { Gsi } from "../dynamodb/gsi";

export interface AccessPatternOptions {
  name: string;
  gsi: Gsi;
  pkAttributeOptions?: ResourceAttributeOptions;
  skAttributeOptions?: ResourceAttributeOptions;
}

export class AccessPattern extends FractureComponent {
  // member components
  public pkAttribute: ResourceAttribute;
  public skAttribute: ResourceAttribute;
  // parent
  public readonly resource: Resource;
  // all other options
  public readonly options: Required<AccessPatternOptions>;

  constructor(resource: Resource, options: AccessPatternOptions) {
    super(resource.fracture);

    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     **************************************************************************/

    const defaultOptions: Partial<AccessPatternOptions> = {
      pkAttributeOptions: {
        name: options.gsi.pkName,
        isPublic: false,
        isRequired: true,
        createGenerator: ResourceAttributeGenerator.COMPOSITION,
        readGenerator: ResourceAttributeGenerator.COMPOSITION,
        updateGenerator: ResourceAttributeGenerator.COMPOSITION,
        deleteGenerator: ResourceAttributeGenerator.COMPOSITION,
        importGenerator: ResourceAttributeGenerator.COMPOSITION,
      },
      skAttributeOptions: {
        name: options.gsi.skName,
        isPublic: false,
        isRequired: true,
        createGenerator: ResourceAttributeGenerator.COMPOSITION,
        readGenerator: ResourceAttributeGenerator.COMPOSITION,
        updateGenerator: ResourceAttributeGenerator.COMPOSITION,
        deleteGenerator: ResourceAttributeGenerator.COMPOSITION,
        importGenerator: ResourceAttributeGenerator.COMPOSITION,
      },
    };

    /***************************************************************************
     *
     * INIT ACCESS PATTERN
     *
     **************************************************************************/

    // ensure names are param-cased
    const forcedOptions: Partial<AccessPatternOptions> = {
      name: paramCase(options.name),
    };

    // all other options
    this.options = deepMerge([
      defaultOptions,
      options,
      forcedOptions,
    ]) as Required<AccessPatternOptions>;

    // the attribute might already be defined.
    const pkAttribute = resource.getAttributeByName(options.gsi.pkName);
    const skAttribute = resource.getAttributeByName(options.gsi.skName);

    // member components
    this.pkAttribute = pkAttribute
      ? pkAttribute
      : new ResourceAttribute(resource, this.options.pkAttributeOptions);
    this.skAttribute = skAttribute
      ? skAttribute
      : new ResourceAttribute(resource, this.options.skAttributeOptions);

    // parent + inverse
    this.resource = resource;
    this.resource.accessPatterns.push(this);
  }

  addPkAttribute(attribute: ResourceAttribute) {
    this.pkAttribute.compositionSources.push(attribute);
  }

  addSkAttribute(attribute: ResourceAttribute) {
    this.skAttribute.compositionSources.push(attribute);
  }
}
