import { FractureComponent } from "../../core";
import {
  AccessPattern,
  AccessPatternOptions,
  ACCESS_PATTERN_TYPE,
} from "../../core/access-pattern";
import { OPERATION_SUB_TYPE } from "../../core/operation";
import { Resource } from "../../core/resource";
import { ResourceAttributeGenerator } from "../../core/resource-attribute";

export class LookupFactory extends FractureComponent {
  public readonly accessPattern: AccessPattern;

  constructor(resource: Resource) {
    super(resource.fracture);

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
      skAttributeOptions: {
        name: dynamoGsi.skName,
        isPublic: false,
        generator: ResourceAttributeGenerator.COMPOSITION,
        generateOn: [
          OPERATION_SUB_TYPE.CREATE_ONE,
          OPERATION_SUB_TYPE.UPDATE_ONE,
        ],
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

    /*
    new Operation(this.accessPattern, {
      operationType: OPERATION_TYPE.QUERY,
      operationSubType: OPERATION_SUB_TYPE.LIST,
    });
    */

    return this;
  }
}
