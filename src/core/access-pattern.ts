import { deepMerge } from "projen/lib/util";
import { ValueOf } from "type-fest";
import { Resource } from "./resource";
import {
  ResourceAttribute,
  ResourceAttributeGenerator,
  ResourceAttributeOptions,
} from "./resource-attribute";
import { FractureComponent } from "../core/component";
import { DynamoGsi } from "../dynamodb/dynamo-gsi";
import { DynamoTable } from "../dynamodb/dynamo-table";

export const ACCESS_PATTERN_TYPE = {
  /**
   * Main PK and PK pattern used to identify this record.
   */
  IDENTIFIER: "Identifier",
  /**
   * Lookup pattern for quick begins_with() searching and such.
   */
  LOOKUP: "lookup",
  /**
   * Any other AP
   */
  OTHER: "other",
} as const;

export interface AccessPatternOptions {
  dynamoGsi?: DynamoGsi;
  pkAttributeOptions?: ResourceAttributeOptions;
  skAttributeOptions?: ResourceAttributeOptions;
  type?: ValueOf<typeof ACCESS_PATTERN_TYPE>;
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
        generator: ResourceAttributeGenerator.COMPOSITION,
        isGeneratedOnCreate: true,
        isGeneratedOnRead: true,
        isGeneratedOnUpdate: true,
        isGeneratedOnDelete: true,
      },
      skAttributeOptions: {
        name: dynamoGsi.skName,
        isPublic: false,
        generator: ResourceAttributeGenerator.COMPOSITION,
        isGeneratedOnCreate: true,
        isGeneratedOnRead: true,
        isGeneratedOnUpdate: true,
        isGeneratedOnDelete: true,
      },
      type: ACCESS_PATTERN_TYPE.OTHER,
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

  public build() {
    /***************************************************************************
     *
     * CRUD OPERATIONS
     *
     * TODO
     *
     **************************************************************************/
    /*
    new Operation(this, {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.LIST,
    });
    */
  }

  addPkAttributeSource(sourceAttribute: ResourceAttribute) {
    this.pkAttribute.compositionSources.push(sourceAttribute);
  }

  addSkAttributeSource(sourceAttribute: ResourceAttribute) {
    this.skAttribute.compositionSources.push(sourceAttribute);
  }

  get isKeyAccessPattern(): boolean {
    return this.dynamoTable.keyDynamoGsi === this.dynamoGsi;
  }

  get isLookupAccessPattern(): boolean {
    return this.dynamoTable.lookupDynamoGsi === this.dynamoGsi;
  }

  get dynamoTable(): DynamoTable {
    return this.dynamoGsi.dynamoTable;
  }

  get dynamoGsi(): DynamoGsi {
    return this.options.dynamoGsi;
  }
}
