import { paramCase } from "change-case";
import { Resource } from "./resource";
import {
  ResourceAttribute,
  ResourceAttributeGenerator,
} from "./resource-attribute";
import { FractureComponent } from "../core/component";
import { Gsi } from "../dynamodb/gsi";

export interface AccessPatternOptions {
  name: string;
  gsi: Gsi;
}

export class AccessPattern extends FractureComponent {
  // member components
  public pkAttribute: ResourceAttribute;
  public skAttribute: ResourceAttribute;
  //public pkAttributes: ResourceAttribute[];
  //public skAttributes: ResourceAttribute[];
  // parent
  public readonly resource: Resource;
  // all other options
  public readonly options: Required<AccessPatternOptions>;

  constructor(resource: Resource, options: AccessPatternOptions) {
    super(resource.fracture);

    /***************************************************************************
     *
     * INIT ACCESS PATTERN
     *
     **************************************************************************/

    // member components
    this.pkAttribute = new ResourceAttribute(resource, {
      name: options.gsi.pkName,
      isPublic: false,
      createGenerator: ResourceAttributeGenerator.COMPOSITION,
      readGenerator: ResourceAttributeGenerator.COMPOSITION,
      updateGenerator: ResourceAttributeGenerator.COMPOSITION,
      deleteGenerator: ResourceAttributeGenerator.COMPOSITION,
      importGenerator: ResourceAttributeGenerator.COMPOSITION,
    });
    this.skAttribute = new ResourceAttribute(resource, {
      name: options.gsi.skName,
      isPublic: false,
      createGenerator: ResourceAttributeGenerator.COMPOSITION,
      readGenerator: ResourceAttributeGenerator.COMPOSITION,
      updateGenerator: ResourceAttributeGenerator.COMPOSITION,
      deleteGenerator: ResourceAttributeGenerator.COMPOSITION,
      importGenerator: ResourceAttributeGenerator.COMPOSITION,
    });

    // parent + inverse
    this.resource = resource;
    this.resource.accessPatterns.push(this);

    // all other options
    this.options = { name: paramCase(options.name), gsi: options.gsi };
  }

  addPkAttribute(attribute: ResourceAttribute) {
    this.pkAttribute.compositionSources.push(attribute);
  }

  addSkAttribute(attribute: ResourceAttribute) {
    this.skAttribute.compositionSources.push(attribute);
  }
}
