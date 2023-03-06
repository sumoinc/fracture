import { join } from "path";
import { camelCase } from "change-case";
import { ValueOf } from "type-fest";
import { BaseCommand } from "./base-command";
import { LAMBDA_EVENT_SOURCE } from "./lambda-commands";
import { Fracture } from "../../../core";
import { AccessPattern } from "../../../core/access-pattern";
import { Operation, OPERATION_SUB_TYPE } from "../../../core/operation";
import { Resource } from "../../../core/resource";
import {
  ResourceAttribute,
  ResourceAttributeGenerator,
} from "../../../core/resource-attribute";
import { Service } from "../../../core/service";
import { Structure } from "../../../core/structure";
import { Gsi } from "../../../dynamodb/gsi";
import { TypeScriptInterfaces } from "../typescript-interfaces";

export interface BaseServiceCommandOptions {
  eventSource: ValueOf<typeof LAMBDA_EVENT_SOURCE>;
}

export class BaseServiceCommand extends BaseCommand {
  public readonly eventSource: ValueOf<typeof LAMBDA_EVENT_SOURCE>;

  constructor(
    operation: Operation,
    commandPath: string,
    options: BaseServiceCommandOptions
  ) {
    super(operation, join(commandPath, `handler.ts`));
    this.eventSource = options.eventSource;
  }

  /**
   * Core Fracture Class helpers
   */
  public get fracture(): Fracture {
    return this.service.fracture;
  }

  public get service(): Service {
    return this.operation.resource.service;
  }

  public get resource(): Resource {
    return this.operation.resource;
  }

  public get tsInterfaceFile(): TypeScriptInterfaces {
    return this.service.tsInterfaceFile;
  }

  public get pathToInterfaces(): string {
    return this.tsInterfaceFile.pathFrom(this);
  }

  /**
   * Structure Helpers
   */

  public get itemVariable(): string {
    return camelCase(this.resource.name);
  }

  public get inputStructure(): Structure {
    return this.operation.inputStructure;
  }

  public get outputStructure(): Structure {
    return this.operation.outputStructure;
  }

  public get inputInferface(): string {
    return this.inputStructure.interfaceName;
  }

  public get outputInferface(): string {
    return this.outputStructure.interfaceName;
  }

  public get generatedAttributes(): ResourceAttribute[] {
    switch (this.operation.operationSubType) {
      case OPERATION_SUB_TYPE.CREATE_ONE:
        return this.resource.createGeneratedAttributes;
        break;
      case OPERATION_SUB_TYPE.READ_ONE:
        return this.resource.readGeneratedAttributes;
        break;
      case OPERATION_SUB_TYPE.UPDATE_ONE:
        return this.resource.updateGeneratedAttributes;
        break;
      case OPERATION_SUB_TYPE.DELETE_ONE:
        return this.resource.deleteGeneratedAttributes;
        break;
      case OPERATION_SUB_TYPE.IMPORT_ONE:
        return this.resource.createGeneratedAttributes;
        break;
      default:
        throw new Error(
          `Unsupported operation type: ${this.operation.operationSubType}`
        );
    }
  }

  public get hasUuidGenerator(): boolean {
    return (
      this.generatedAttributes.filter(
        (attribute) =>
          this.getAttributeGenerator(attribute) ===
          ResourceAttributeGenerator.GUID
      ).length > 0
    );
  }

  /**
   * Dynamo DB helpers
   */

  public get tableName(): string {
    return this.service.dynamodb.name;
  }

  public get keyPattern(): AccessPattern {
    return this.operation.resource.keyPattern;
  }

  public get keyGsi(): Gsi {
    return this.service.dynamodb.keyGsi;
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

  getAttributeGenerator = (
    attribute: ResourceAttribute
  ): ValueOf<typeof ResourceAttributeGenerator> => {
    switch (this.operation.operationSubType) {
      case OPERATION_SUB_TYPE.CREATE_ONE:
        return attribute.createGenerator;
        break;
      case OPERATION_SUB_TYPE.READ_ONE:
        return attribute.readGenerator;
        break;
      case OPERATION_SUB_TYPE.UPDATE_ONE:
        return attribute.updateGenerator;
        break;
      case OPERATION_SUB_TYPE.DELETE_ONE:
        return attribute.deleteGenerator;
        break;
      case OPERATION_SUB_TYPE.IMPORT_ONE:
        return attribute.createGenerator;
        break;
      default:
        throw new Error(
          `Unsupported operation type: ${this.operation.operationSubType}`
        );
    }
  };

  writeClientImports = () => {
    this.line(`import { DynamoDBClient } from "@aws-sdk/client-dynamodb";`);
    this.line(
      `import { DynamoDBDocumentClient, ${this.dynamoCommandName} } from "@aws-sdk/lib-dynamodb";`
    );
    this.line(`import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";`);
  };

  writeUuidImport = () => {
    if (this.hasUuidGenerator) {
      this.line(`import { v4 as uuidv4 } from "uuid";`);
    }
  };

  writeLambdaEventImport = () => {
    switch (this.eventSource) {
      case LAMBDA_EVENT_SOURCE.API_GATEWAY:
        this.line(`// import { ??? } from "aws-lambda";`);
        break;
      case LAMBDA_EVENT_SOURCE.APP_SYNC:
        this.line(`import { AppSyncResolverEvent } from "aws-lambda";`);
        break;
      case LAMBDA_EVENT_SOURCE.DYNAMODB:
        this.line(`// import { ??? } from "aws-lambda";`);
        break;
      case LAMBDA_EVENT_SOURCE.KAFKA:
        this.line(`// import { ??? } from "aws-lambda";`);
        break;
      case LAMBDA_EVENT_SOURCE.KINESIS:
        this.line(`// import { ??? } from "aws-lambda";`);
        break;
      case LAMBDA_EVENT_SOURCE.S3:
        this.line(`// import { ??? } from "aws-lambda";`);
        break;
      case LAMBDA_EVENT_SOURCE.SNS:
        this.line(`// import { ??? } from "aws-lambda";`);
        break;
      case LAMBDA_EVENT_SOURCE.SQS:
        this.line(`// import { ??? } from "aws-lambda";`);
        break;
      default:
        throw new Error(`Unknown event source: ${this.eventSource}`);
    }
  };

  writeInterfaceImport = () => {
    this.open(`import {`);
    this.line(`${this.resource.interfaceNameDynamo},`);
    this.line(`${this.inputInferface},`);
    this.line(`${this.outputInferface},`);
    this.line(`${this.resource.interfaceName},`);
    this.close(`} from "${this.pathToInterfaces}";`);
  };

  writeClient = () => {
    this.line(`const client = new DynamoDBClient({});`);
    this.line(`const dynamo = DynamoDBDocumentClient.from(client);`);
    this.line(`const tableName = "${this.tableName}";`);
    this.line(`\n`);
  };

  writeHandlerOpen = () => {
    this.open("export const handler = async (");
    switch (this.eventSource) {
      case LAMBDA_EVENT_SOURCE.API_GATEWAY:
        this.line(`event: any`);
        break;
      case LAMBDA_EVENT_SOURCE.APP_SYNC:
        this.line(`event: AppSyncResolverEvent<${this.inputInferface}, any>`);
        break;
      case LAMBDA_EVENT_SOURCE.DYNAMODB:
        this.line(`event: any`);
        break;
      case LAMBDA_EVENT_SOURCE.KAFKA:
        this.line(`event: any`);
        break;
      case LAMBDA_EVENT_SOURCE.KINESIS:
        this.line(`event: any`);
        break;
      case LAMBDA_EVENT_SOURCE.S3:
        this.line(`event: any`);
        break;
      case LAMBDA_EVENT_SOURCE.SNS:
        this.line(`event: any`);
        break;
      case LAMBDA_EVENT_SOURCE.SQS:
        this.line(`event: any`);
        break;
      default:
        throw new Error(`Unknown event source: ${this.eventSource}`);
    }
    this.close(`): Promise<${this.outputInferface}> => {`);
    this.open("");
  };

  writeHandlerClose = () => {
    this.close(`};`);
  };

  writeGeneratedValue = (attribute: ResourceAttribute) => {
    const generator = this.getAttributeGenerator(attribute);
    switch (generator) {
      case ResourceAttributeGenerator.GUID:
        this.line(`${attribute.shortName}: uuidv4(),`);
        break;
      case ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP:
        this.line(`${attribute.shortName}: new Date().toISOString(),`);
        break;
      case ResourceAttributeGenerator.TYPE:
        this.line(`${attribute.shortName}: "${this.resource.interfaceName}",`);
        break;
      case ResourceAttributeGenerator.VERSION:
        this.line(
          `${attribute.shortName}: "${this.resource.versioningStrategy.currentVersion}",`
        );
        break;
      default:
        throw new Error(`Unknown generator: ${generator}`);
    }
  };

  writeShape = () => {
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
        `${resourceAttribute.shortName}: event.arguments.${resourceAttribute.attributeName},`
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

    // init the key
    this.line(`/**`);
    this.line(` * Build the key for this item.`);
    this.line(` */`);
    this.open(`const key = {`);
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
