import { join } from "path";
import { FractureComponent } from "../../../core";
import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Operation, OPERATION_SUB_TYPE } from "../../../core/operation";
import { Resource } from "../../../core/resource";
import { ResourceAttributeGenerator } from "../../../core/resource-attribute";
import { Service } from "../../../core/service";
import { TypescriptOperation } from "../typescript-operation";
import { TypescriptResource } from "../typescript-resource";
import { TypescriptService } from "../typescript-service";
import { TypeScriptSource } from "../typescript-source";

export class DynamoCommand extends FractureComponent {
  public readonly operation: Operation;
  public readonly resource: Resource;
  public readonly service: Service;
  public readonly tsOperation: TypescriptOperation;
  public readonly tsResource: TypescriptResource;
  public readonly tsService: TypescriptService;
  public readonly tsFile: TypeScriptSource;

  constructor(tsOperation: TypescriptOperation) {
    super(tsOperation.fracture);
    this.operation = tsOperation.operation;
    this.resource = tsOperation.operation.resource;
    this.service = tsOperation.operation.resource.service;
    this.tsOperation = tsOperation;
    this.tsResource = tsOperation.tsResource;
    this.tsService = tsOperation.tsResource.tsService;

    this.tsFile = new TypeScriptSource(
      this,
      join(
        this.tsService.outdir,
        "dynamodb",
        "commands",
        `${this.operation.name}.ts`
      )
    );

    this.tsFile.lines([
      `import { DynamoDBClient } from "@aws-sdk/client-dynamodb";`,
      `import { DynamoDBDocumentClient, ${this.dynamoCommandName} } from "@aws-sdk/lib-dynamodb";`,
      `import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";`,
    ]);

    this.tsFile.open(`import {`);
    this.tsFile.line(this.tsResource.interfaceNameForDynamo + ",");
    if (this.isKeyRequired) {
      this.tsFile.line(this.tsService.dynamoKeyName + ",");
    }
    this.tsFile.line(this.tsResource.interfaceName);
    this.tsFile.close(
      `} from "${this.tsService.typeFile.pathFrom(this.tsFile)}";`
    );
    this.tsFile.line("");

    this.tsFile.lines([
      `const client = new DynamoDBClient({});`,
      `const dynamo = DynamoDBDocumentClient.from(client);`,
      `const tableName = "${this.service.dynamodb.name}";`,
      ``,
    ]);

    this.tsFile.open(`export const ${this.functionName} = async (`);
    this.tsFile.line(`input: ${this.tsResource.interfaceName}`);
    this.tsFile.close(`): Promise<${this.tsResource.interfaceName}> => {`);
    this.tsFile.open("");

    /**
     * write the item definition based on inputs
     */
    this.tsFile.line(`/**`);
    this.tsFile.line(
      ` * Initialize the shape dynamo expects. This may differ from the externally`
    );
    this.tsFile.line(` * exposed shape.`);
    this.tsFile.line(` */`);
    this.tsFile.open(`const item: ${this.resource.interfaceNameDynamo} = {`);
    this.operation.generatedAttributes.forEach((attribute) => {
      const generator = attribute.generatorForOperation(this.operation);
      switch (generator) {
        case ResourceAttributeGenerator.GUID:
          this.tsFile.line(`${attribute.shortName}: uuidv4(),`);
          break;
        case ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP:
          this.tsFile.line(`${attribute.shortName}: new Date().toISOString(),`);
          break;
        case ResourceAttributeGenerator.TYPE:
          this.tsFile.line(
            `${attribute.shortName}: "${this.resource.interfaceName}",`
          );
          break;
        case ResourceAttributeGenerator.VERSION:
          this.tsFile.line(
            `${attribute.shortName}: "${this.resource.versionStrategy.currentVersion}",`
          );
          break;
        default:
          throw new Error(`Unknown generator: ${generator}`);
      }
    });
    /*
    this.tsFile.inputStructure.attributes.forEach((attribute) => {
      const { resourceAttribute } = attribute;
      this.line(
        `${resourceAttribute.shortName}: input.${resourceAttribute.attributeName},`
      );
    });
    */
    this.tsFile.close(`};`);
    this.tsFile.line(`\n`);

    /**
     * If we need to add key values to the shape, do it here.
     */
    if (this.isKeyRequired) {
      const pk = this.resource.keyAccessPattern.pk
        .map((k) => "item." + k.shortName)
        .join(' + "#" + ');
      const sk = this.resource.keyAccessPattern.sk
        .map((k) => "item." + k.shortName)
        .join(' + "#" + ');
      this.tsFile.line(`/**`);
      this.tsFile.line(` * Add key values to the shape.`);
      this.tsFile.line(` */`);
      this.tsFile.open(`const key: ${this.tsService.dynamoKeyName} = {`);
      this.tsFile.line(`${this.tsService.dynamoPkName}: ${pk},`);
      this.tsFile.line(`${this.tsService.dynamoSkName}: ${sk},`);
      this.tsFile.close(`};`);
      this.tsFile.line(`\n`);
    }

    this.tsFile.close(`};`);
  }

  /**
   * determine which dynamo command we will need for this operation.
   */
  public get dynamoCommandName(): string {
    switch (this.operation.operationSubType) {
      case OPERATION_SUB_TYPE.CREATE_ONE:
        return "PutCommand";
      case OPERATION_SUB_TYPE.READ_ONE:
        return "GetCommand";
      case OPERATION_SUB_TYPE.UPDATE_ONE:
        return "UpdateCommand";
      case OPERATION_SUB_TYPE.DELETE_ONE:
        return "DeleteCommand";
      case OPERATION_SUB_TYPE.IMPORT_ONE:
        return "PutCommand";
      default:
        throw new Error(
          `Unsupported operation type: ${this.operation.operationSubType}`
        );
    }
  }

  /**
   * is this an operation that requires the key?
   */
  public get isKeyRequired(): boolean {
    switch (this.operation.operationSubType) {
      case OPERATION_SUB_TYPE.CREATE_ONE:
      case OPERATION_SUB_TYPE.IMPORT_ONE:
        return false;
      default:
        return true;
    }
  }

  /**
   * Gets formatted interface name for this resource
   */
  public get functionName() {
    return formatStringByNamingStrategy(
      this.operation.name,
      this.fracture.namingStrategy.ts.functionName
    );
  }

  // writeImports = () => {
  //   // add uuid if needed for generator
  //   if (this.hasAttributeGenerator(ResourceAttributeGenerator.GUID)) {
  //     this.line(`import { v4 as uuidv4 } from "uuid";`);
  //   }

  // writeItem = () => {
  //   // init shape
  //   this.line(`/**`);
  //   this.line(
  //     ` * Initialize the shape dynamo expects. This may differ from the externally`
  //   );
  //   this.line(` * exposed shape.`);
  //   this.line(` */`);
  //   this.open(
  //     `let ${this.itemVariable}: ${this.resource.interfaceNameDynamo} = {`
  //   );
  //   this.generatedAttributes.forEach((attribute) => {
  //     this.writeGeneratedValue(attribute);
  //   });
  //   this.inputStructure.attributes.forEach((attribute) => {
  //     const { resourceAttribute } = attribute;
  //     this.line(
  //       `${resourceAttribute.shortName}: input.${resourceAttribute.attributeName},`
  //     );
  //   });
  //   this.close(`};`);
  //   this.line(`\n`);

  //   this.line(`/**`);
  //   this.line(` * Add key values to the shape.`);
  //   this.line(` */`);
  //   const pk = this.keyAccessPattern.pk
  //     .map((k) => this.itemVariable + "." + k.shortName)
  //     .join(' + "#" + ');
  //   this.line(`${this.itemVariable}.${this.keyGsi.pkName} = ${pk};`);
  //   const sk = this.keyAccessPattern.sk
  //     .map((k) => this.itemVariable + "." + k.shortName)
  //     .join(' + "#" + ');
  //   this.line(`${this.itemVariable}.${this.keyGsi.skName} = ${sk};`);
  //   this.line(`\n`);
  // };

  // writeKey = () => {
  //   // init the key
  //   this.line(`/**`);
  //   this.line(` * Build the key for this item.`);
  //   this.line(` */`);
  //   this.open(`const ${this.keyVariable} = {`);
  //   this.line(
  //     `${this.keyGsi.pkName}: ${this.itemVariable}.${this.keyGsi.pkName},`
  //   );
  //   this.line(
  //     `${this.keyGsi.skName}: ${this.itemVariable}.${this.keyGsi.skName},`
  //   );
  //   this.close(`};`);
  //   this.line(`\n`);
  // };

  preSynthesize() {
    super.preSynthesize();
  }
}
