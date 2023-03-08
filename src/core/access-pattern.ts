import { paramCase } from "change-case";
import { Resource } from "./resource";
import { ResourceAttribute } from "./resource-attribute";
import { FractureComponent } from "../core/component";
import { Gsi } from "../dynamodb/gsi";

export interface AccessPatternOptions {
  name: string;
  gsi: Gsi;
}

export class AccessPattern extends FractureComponent {
  // member components
  public pkAttributes: ResourceAttribute[];
  public skAttributes: ResourceAttribute[];
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
    this.pkAttributes = [];
    this.skAttributes = [];

    // parent + inverse
    this.resource = resource;
    this.resource.accessPatterns.push(this);

    // all other options
    this.options = { name: paramCase(options.name), gsi: options.gsi };
  }

  public get pkName() {
    return this.options.gsi.pkName;
  }
  public get skName() {
    return this.options.gsi.skName;
  }

  addPkAttribute(attribute: ResourceAttribute) {
    this.pkAttributes.push(attribute);
  }

  addSkAttribute(attribute: ResourceAttribute) {
    this.skAttributes.push(attribute);
  }
}
