import { Component } from "projen";
import {
  AccessPattern,
  AccessPatternOptions,
  ACCESS_PATTERN_TYPE,
} from "../../core/access-pattern.ts";
import {
  Operation,
  OPERATION_SUB_TYPE,
  OPERATION_TYPE,
} from "../../core/operation.ts/index.js";
import { ResourceAttributeGenerator } from "../../core/resource-attribute.ts";
import { Resource } from "../../core/resource.ts";

export class LookupFactory extends Component {
  public readonly accessPattern: AccessPattern;

  constructor(resource: Resource) {
    super(resource.project);

    /***************************************************************************
     * DYNAMO
     **************************************************************************/

    // find the key GSI
    const dynamoGsi = resource.dynamoTable.lookupDynamoGsi;

    /***************************************************************************
     * ACCESS PATTERN
     **************************************************************************/

    const options: Required<AccessPatternOptions> = {
      dynamoGsi,
      // this will already exist as part of the main key, so don't bother
      // setting anything other than it's name
      pkAttributeOptions: {
        name: dynamoGsi.pkName,
      },
      // we allow this to be searched on publically
      skAttributeOptions: {
        name: "lookup-text",
        shortName: dynamoGsi.skName,
        isPublic: false,
        generator: ResourceAttributeGenerator.COMPOSITION,
        generateOn: [
          OPERATION_SUB_TYPE.CREATE_ONE,
          OPERATION_SUB_TYPE.UPDATE_ONE,
        ],
        outputOn: [OPERATION_SUB_TYPE.LIST],
        compositionSeperator: " ",
      },
      type: ACCESS_PATTERN_TYPE.LOOKUP,
    };

    // create access pattern, add to resource
    this.accessPattern = new AccessPattern(resource, options);

    /***************************************************************************
     *
     * ADD OPERATIONS
     *
     * List operation for now
     *
     **************************************************************************/

    new Operation(this.accessPattern, {
      operationType: OPERATION_TYPE.QUERY,
      operationSubType: OPERATION_SUB_TYPE.LIST,
    });

    return this;
  }
}
