import { deepMerge } from "projen/lib/util";
import { ValueOf } from "type-fest";
import { Operation, OPERATION_SUB_TYPE } from "./operation";
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
  public operations: Operation[] = [];
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
        generateOn: [
          OPERATION_SUB_TYPE.CREATE_ONE,
          OPERATION_SUB_TYPE.READ_ONE,
          OPERATION_SUB_TYPE.UPDATE_ONE,
          OPERATION_SUB_TYPE.DELETE_ONE,
        ],
      },
      skAttributeOptions: {
        name: dynamoGsi.skName,
        isPublic: false,
        generator: ResourceAttributeGenerator.COMPOSITION,
        generateOn: [
          OPERATION_SUB_TYPE.CREATE_ONE,
          OPERATION_SUB_TYPE.READ_ONE,
          OPERATION_SUB_TYPE.UPDATE_ONE,
          OPERATION_SUB_TYPE.DELETE_ONE,
        ],
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

    this.project.logger.info(
      `Access Pattern for: "${this.pkAttribute.name}:${this.skAttribute.name}" initialized.`
    );

    return this;
  }

  public build() {
    this.project.logger.debug(
      `BUILD Access Pattern: "${this.pkAttribute.name}:${this.skAttribute.name}" called.`
    );
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

  /**
   * Returns operation for given sub-type
   */
  public getOperation(
    operationSubType: ValueOf<typeof OPERATION_SUB_TYPE>
  ): Operation {
    const returnOperation = this.operations.find(
      (o) => o.operationSubType === operationSubType
    );

    if (!returnOperation) {
      throw new Error(`Operation not found for sub-type: ${operationSubType}`);
    }

    return returnOperation;
  }

  public get createOperation(): Operation {
    return this.getOperation(OPERATION_SUB_TYPE.CREATE_ONE);
  }

  public get readOperation(): Operation {
    return this.getOperation(OPERATION_SUB_TYPE.READ_ONE);
  }

  public get updateOperation(): Operation {
    return this.getOperation(OPERATION_SUB_TYPE.UPDATE_ONE);
  }

  public get deleteOperation(): Operation {
    return this.getOperation(OPERATION_SUB_TYPE.DELETE_ONE);
  }

  public get isKeyAccessPattern(): boolean {
    return this.dynamoTable.keyDynamoGsi === this.dynamoGsi;
  }

  public get isLookupAccessPattern(): boolean {
    return this.dynamoTable.lookupDynamoGsi === this.dynamoGsi;
  }

  public get dynamoTable(): DynamoTable {
    return this.dynamoGsi.dynamoTable;
  }

  public get dynamoGsi(): DynamoGsi {
    return this.options.dynamoGsi;
  }
}
