import { IdentifierFactory } from "./identifier-factory";
import { OPERATION_SUB_TYPE } from "../../core/operation";
import { Resource } from "../../core/resource";
import {
  ResourceAttributeGenerator,
  ResourceAttributeType,
} from "../../core/resource-attribute";

export class VersionedIdentifierFactory extends IdentifierFactory {
  constructor(resource: Resource) {
    super(resource);

    /***************************************************************************
     *
     * ATTRIBUTES
     *
     * Add version as resource attribute.
     *
     **************************************************************************/

    const versionAttribute = resource.addResourceAttribute({
      name: "version",
      shortName: "v",
      comments: [`The version of this record`, `@default "LATEST"`],
      type: ResourceAttributeType.STRING,
      isRequired: true,
      generator: ResourceAttributeGenerator.VERSION_DATE_TIME_STAMP,
      generateOn: [
        OPERATION_SUB_TYPE.CREATE_ONE,
        OPERATION_SUB_TYPE.READ_ONE,
        OPERATION_SUB_TYPE.UPDATE_ONE,
        OPERATION_SUB_TYPE.DELETE_ONE,
        OPERATION_SUB_TYPE.LIST,
      ],
      defaultOn: [
        { operationSubType: OPERATION_SUB_TYPE.CREATE_ONE, default: "LATEST" },
        { operationSubType: OPERATION_SUB_TYPE.READ_ONE, default: "LATEST" },
        { operationSubType: OPERATION_SUB_TYPE.UPDATE_ONE, default: "LATEST" },
        { operationSubType: OPERATION_SUB_TYPE.DELETE_ONE, default: "LATEST" },
        { operationSubType: OPERATION_SUB_TYPE.LIST, default: "LATEST" },
      ],
    });
    this.accessPattern.addSkAttributeSource(versionAttribute);

    /***************************************************************************
     *
     * ADD OPERATIONS
     *
     * This pattern gets create and read operations only
     *
     **************************************************************************/

    /*
    new Operation(this.accessPattern, {
      operationType: OPERATION_TYPE.MUTATION,
      operationSubType: OPERATION_SUB_TYPE.CREATE_VERSION,
    });
    new Operation(this.accessPattern, {
      operationType: OPERATION_TYPE.QUERY,
      operationSubType: OPERATION_SUB_TYPE.READ_VERSION,
    });
    */

    return this;
  }
}
