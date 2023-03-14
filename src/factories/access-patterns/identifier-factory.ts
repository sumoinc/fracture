import { FractureComponent } from "../../core";
import {
  AccessPattern,
  AccessPatternOptions,
  ACCESS_PATTERN_TYPE,
} from "../../core/access-pattern";
import {
  Operation,
  OPERATION_SUB_TYPE,
  OPERATION_TYPE,
} from "../../core/operation";
import { Resource } from "../../core/resource";
import {
  ResourceAttributeGenerator,
  ResourceAttributeType,
} from "../../core/resource-attribute";

export class IdentifierFactory extends FractureComponent {
  public readonly accessPattern: AccessPattern;

  constructor(resource: Resource) {
    super(resource.fracture);

    /***************************************************************************
     * DYNAMO
     **************************************************************************/

    // find the key GSI
    const dynamoGsi = resource.dynamoTable.keyDynamoGsi;

    /***************************************************************************
     * ACCESS PATTERN
     **************************************************************************/

    const options: Required<AccessPatternOptions> = {
      dynamoGsi,
      pkAttributeOptions: {
        name: dynamoGsi.pkName,
        isPublic: false,
        generator: ResourceAttributeGenerator.COMPOSITION,
        generateOn: [OPERATION_SUB_TYPE.CREATE_ONE],
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
      type: ACCESS_PATTERN_TYPE.IDENTIFIER,
    };

    // create access pattern, add to resource
    this.accessPattern = new AccessPattern(resource, options);

    /***************************************************************************
     *
     * ATTRIBUTES
     *
     * Add id and version as resource attributes.
     *
     **************************************************************************/

    const idAttribute = resource.addResourceAttribute({
      name: "id",
      comments: ["The id for the record."],
      type: ResourceAttributeType.STRING,
      isRequired: true,
      generator: ResourceAttributeGenerator.GUID,
      generateOn: [OPERATION_SUB_TYPE.CREATE_ONE],
    });
    this.accessPattern.addPkAttributeSource(idAttribute);

    const typeAttribute = resource.addResourceAttribute({
      name: "type",
      shortName: "t",
      comments: ["The type for this record."],
      type: ResourceAttributeType.STRING,
      isRequired: true,
      generator: ResourceAttributeGenerator.TYPE,
      generateOn: [
        OPERATION_SUB_TYPE.CREATE_ONE,
        OPERATION_SUB_TYPE.READ_ONE,
        OPERATION_SUB_TYPE.UPDATE_ONE,
        OPERATION_SUB_TYPE.DELETE_ONE,
      ],
    });
    this.accessPattern.addSkAttributeSource(typeAttribute);

    /***************************************************************************
     *
     * ADD OPERATIONS
     *
     * This pattern gets all CRUD operations.
     *
     **************************************************************************/

    new Operation(this.accessPattern, {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.CREATE_ONE,
    });
    new Operation(this.accessPattern, {
      operationType: OPERATION_TYPE.QUERY,
      operationSubType: OPERATION_SUB_TYPE.READ_ONE,
    });
    new Operation(this.accessPattern, {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.UPDATE_ONE,
    });
    new Operation(this.accessPattern, {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.DELETE_ONE,
    });

    return this;
  }
}
