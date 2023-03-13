import { deepMerge } from "projen/lib/util";
import { AttributeGenerator } from "./attribute";
import { Resource } from "./resource";
import {
  ResourceAttribute,
  ResourceAttributeOptions,
} from "./resource-attribute";
import { FractureComponent } from "../core/component";
import { DynamoGsi } from "../dynamodb/dynamo-gsi";

export interface AccessPatternOptions {
  dynamoGsi?: DynamoGsi;
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

    // make a new gsi is one wasn't passed into the Access Pattern
    const dynamoGsi = options.dynamoGsi
      ? options.dynamoGsi
      : new DynamoGsi(resource.dynamoTable);

    const defaultOptions: Required<AccessPatternOptions> = {
      dynamoGsi,
      pkAttributeOptions: {
        name: dynamoGsi.pkName,
        isPublic: false,
        generator: AttributeGenerator.COMPOSITION,
        isGeneratedOnCreate: true,
      },
      skAttributeOptions: {
        name: dynamoGsi.skName,
        isPublic: false,
        generator: AttributeGenerator.COMPOSITION,
        isGeneratedOnCreate: true,
        isGeneratedOnUpate: true,
        isGeneratedOnDelete: true,
      },
    };

    /***************************************************************************
     *
     * INIT ACCESS PATTERN
     *
     **************************************************************************/

    // all other options
    this.options = deepMerge([
      defaultOptions,
      options,
    ]) as Required<AccessPatternOptions>;

    // the attribute might already be defined.
    const pkAttribute = resource.getAttributeByName(dynamoGsi.pkName);
    const skAttribute = resource.getAttributeByName(dynamoGsi.skName);

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

  addPkAttributeSource(sourceAttribute: ResourceAttribute) {
    this.pkAttribute.compositionSources.push(sourceAttribute);
  }

  addSkAttributeSource(sourceAttribute: ResourceAttribute) {
    this.skAttribute.compositionSources.push(sourceAttribute);
  }

  get dynamoGsi(): DynamoGsi {
    return this.options.dynamoGsi;
  }
}
