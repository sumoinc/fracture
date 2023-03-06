import { Operation, OPERATION_SUB_TYPE } from "../../../../core/operation";
import { ResourceAttributeGenerator } from "../../../../core/resource-attribute";
import { BaseCommand } from "../base-command";

export class DynamoCommand extends BaseCommand {
  public readonly operation: Operation;

  constructor(operation: Operation, commandPath: string) {
    super(operation, commandPath);
    this.operation = operation;
  }

  public get dynamoCommandName(): string {
    switch (this.operation.operationSubType) {
      case OPERATION_SUB_TYPE.CREATE_ONE:
        return "PutCommand";
        break;
      case OPERATION_SUB_TYPE.READ_ONE:
        return "GetCommand";
        break;
      case OPERATION_SUB_TYPE.UPDATE_ONE:
        return "UpdateCommand";
        break;
      case OPERATION_SUB_TYPE.DELETE_ONE:
        return "DeleteCommand";
        break;
      case OPERATION_SUB_TYPE.IMPORT_ONE:
        return "PutCommand";
        break;
      default:
        throw new Error(
          `Unsupported operation type: ${this.operation.operationSubType}`
        );
    }
  }

  writeImports = () => {
    // import Dynamo client
    this.line(`import { DynamoDBClient } from "@aws-sdk/client-dynamodb";`);
    this.line(
      `import { DynamoDBDocumentClient, ${this.dynamoCommandName} } from "@aws-sdk/lib-dynamodb";`
    );
    this.line(`import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";`);

    // add uuid if needed for generator
    if (this.hasAttributeGenerator(ResourceAttributeGenerator.GUID)) {
      this.line(`import { v4 as uuidv4 } from "uuid";`);
    }

    // interface imports
    this.open(`import {`);
    this.line(`${this.resource.interfaceNameDynamo},`);
    this.line(`${this.inputInferface},`);
    this.line(`${this.outputInferface},`);
    // this.line(`${this.resource.interfaceName},`);
    this.close(`} from "${this.pathToInterfaces}";`);
  };

  writeDynamoClient = () => {
    this.line(`const client = new DynamoDBClient({});`);
    this.line(`const dynamo = DynamoDBDocumentClient.from(client);`);
    this.line(`const tableName = "${this.tableName}";`);
    this.line(`\n`);
  };

  writeCommandOpen = () => {
    this.open(`export const ${this.commandName} = async (`);
    this.line(`input: ${this.inputInferface}`);
    this.close(`): Promise<${this.outputInferface}> => {`);
    this.open("");
  };

  writeCommandClose = () => {
    this.close(`};`);
  };

  writeItem = () => {
    // init shape
    this.line(`/**`);
    this.line(
      ` * Initialize the shape dynamo expects. This may differ from the externally`
    );
    this.line(` * exposed shape.`);
    this.line(` */`);
    this.open(
      `let ${this.itemVariable}: ${this.resource.interfaceNameDynamo} = {`
    );
    this.generatedAttributes.forEach((attribute) => {
      this.writeGeneratedValue(attribute);
    });
    this.inputStructure.attributes.forEach((attribute) => {
      const { resourceAttribute } = attribute;
      this.line(
        `${resourceAttribute.shortName}: input.${resourceAttribute.attributeName},`
      );
    });
    this.close(`};`);
    this.line(`\n`);

    this.line(`/**`);
    this.line(` * Add key values to the shape.`);
    this.line(` */`);
    const pk = this.keyPattern.pk
      .map((k) => this.itemVariable + "." + k.shortName)
      .join(' + "#" + ');
    this.line(`${this.itemVariable}.${this.keyGsi.pkName} = ${pk};`);
    const sk = this.keyPattern.sk
      .map((k) => this.itemVariable + "." + k.shortName)
      .join(' + "#" + ');
    this.line(`${this.itemVariable}.${this.keyGsi.skName} = ${sk};`);
    this.line(`\n`);
  };

  writeKey = () => {
    // init the key
    this.line(`/**`);
    this.line(` * Build the key for this item.`);
    this.line(` */`);
    this.open(`const ${this.keyVariable} = {`);
    this.line(
      `${this.keyGsi.pkName}: ${this.itemVariable}.${this.keyGsi.pkName},`
    );
    this.line(
      `${this.keyGsi.skName}: ${this.itemVariable}.${this.keyGsi.skName},`
    );
    this.close(`};`);
    this.line(`\n`);
  };

  preSynthesize() {
    super.preSynthesize();
  }
}
