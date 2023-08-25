import { paramCase } from "change-case";
import { Component } from "projen";
import { Resource } from "./resource";
import { ResourceAttribute } from "./resource-attribute";
import { DynamoGsi } from "../dynamodb/dynamo-gsi";

export interface AccessPatternOptions {
  /**
   * name for tihs access pattern
   */
  name: string;
  /**
   * The GSI used to read data.
   */
  dynamoGsi: DynamoGsi;
  /**
   * The pk used to lookup the data
   */
  pk: ResourceAttribute;
  /**
   * The sk used to lookup the data
   */
  sk: ResourceAttribute;
}

export class AccessPattern extends Component {
  /**
   * name for tihs access pattern
   */
  public readonly name: string;
  /**
   * The GSI used to read data.
   */
  public readonly dynamoGsi: DynamoGsi;
  /**
   * The pk used to lookup the data
   */
  public readonly pk: ResourceAttribute;
  /**
   * The sk used to lookup the data
   */
  public readonly sk: ResourceAttribute;

  constructor(resource: Resource, options: AccessPatternOptions) {
    super(resource.project);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = paramCase(options.name);
    this.dynamoGsi = options.dynamoGsi;
    this.pk = options.pk;
    this.sk = options.sk;

    /***************************************************************************
     *
     * DEFAULT OPTIONS
     *
     **************************************************************************/

    // make a new gsi is one wasn't passed into the Access Pattern
    // const dynamoGsi = options.dynamoGsi
    //   ? options.dynamoGsi
    //   : new DynamoGsi(resource.dynamoTable);

    // const defaultOptions: Required<AccessPatternOptions> = {
    //   dynamoGsi,
    //   pkAttributeOptions: {
    //     name: dynamoGsi.pkName,
    //     isPublic: false,
    //     generator: ResourceAttributeGenerator.COMPOSITION,
    //     generateOn: [
    //       OPERATION_SUB_TYPE.CREATE_ONE,
    //       OPERATION_SUB_TYPE.READ_ONE,
    //       OPERATION_SUB_TYPE.UPDATE_ONE,
    //       OPERATION_SUB_TYPE.DELETE_ONE,
    //     ],
    //   },
    //   skAttributeOptions: {
    //     name: dynamoGsi.skName,
    //     isPublic: false,
    //     generator: ResourceAttributeGenerator.COMPOSITION,
    //     generateOn: [
    //       OPERATION_SUB_TYPE.CREATE_ONE,
    //       OPERATION_SUB_TYPE.READ_ONE,
    //       OPERATION_SUB_TYPE.UPDATE_ONE,
    //       OPERATION_SUB_TYPE.DELETE_ONE,
    //     ],
    //   },
    //   type: ACCESS_PATTERN_TYPE.OTHER,
    // };

    /***************************************************************************
     *
     * INIT ACCESS PATTERN
     *
     **************************************************************************/

    // all other options
    // this.options = deepMerge([
    //   defaultOptions,
    //   options,
    // ]) as Required<AccessPatternOptions>;
    // // the attribute might already be defined.
    // const pkAttribute = resource.getAttributeByName(dynamoGsi.pkName);
    // const skAttribute = resource.getAttributeByName(dynamoGsi.skName);

    // // member components
    // this.pkAttribute = pkAttribute
    //   ? pkAttribute
    //   : new ResourceAttribute(resource, this.options.pkAttributeOptions);
    // this.skAttribute = skAttribute
    //   ? skAttribute
    //   : new ResourceAttribute(resource, this.options.skAttributeOptions);

    // // parent + inverse
    // this.resource = resource;
    // this.resource.accessPatterns.push(this);

    // this.project.logger.info(
    //   `Access Pattern for: "${this.pkAttribute.name}:${this.skAttribute.name}" initialized.`
    // );

    return this;
  }

  // addPkAttributeSource(sourceAttribute: ResourceAttribute) {
  //   this.pkAttribute.compositionSources.push(sourceAttribute);
  // }

  // addSkAttributeSource(sourceAttribute: ResourceAttribute) {
  //   this.skAttribute.compositionSources.push(sourceAttribute);
  // }

  // /**
  //  * Returns operation for given sub-type
  //  */
  // public getOperation(
  //   operationSubType: ValueOf<typeof OPERATION_SUB_TYPE>
  // ): Operation {
  //   const returnOperation = this.operations.find(
  //     (o) => o.operationSubType === operationSubType
  //   );

  //   if (!returnOperation) {
  //     throw new Error(`Operation not found for sub-type: ${operationSubType}`);
  //   }

  //   return returnOperation;
  // }

  // public get createOperation(): Operation {
  //   return this.getOperation(OPERATION_SUB_TYPE.CREATE_ONE);
  // }

  // public get readOperation(): Operation {
  //   return this.getOperation(OPERATION_SUB_TYPE.READ_ONE);
  // }

  // public get updateOperation(): Operation {
  //   return this.getOperation(OPERATION_SUB_TYPE.UPDATE_ONE);
  // }

  // public get deleteOperation(): Operation {
  //   return this.getOperation(OPERATION_SUB_TYPE.DELETE_ONE);
  // }

  // public get isKeyAccessPattern(): boolean {
  //   return this.dynamoTable.keyDynamoGsi === this.dynamoGsi;
  // }

  // public get isLookupAccessPattern(): boolean {
  //   return this.dynamoTable.lookupDynamoGsi === this.dynamoGsi;
  // }

  // public get dynamoTable(): DynamoTable {
  //   return this.dynamoGsi.dynamoTable;
  // }

  // public get dynamoGsi(): DynamoGsi {
  //   return this.options.dynamoGsi;
  // }
}
