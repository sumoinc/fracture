import { camelCase } from "change-case";
import { ValueOf } from "type-fest";
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
import { TypeScriptSource } from "../typescript-source";

export class BaseCommand extends TypeScriptSource {
  public readonly operation: Operation;

  constructor(operation: Operation, commandPath: string) {
    super(operation.resource.service, commandPath);
    this.operation = operation;
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
    return this.resource.tsInterfaceFile;
  }

  public get pathToInterfaces(): string {
    return this.tsInterfaceFile.pathFrom(this);
  }

  public get commandName(): string {
    return this.operation.commandName;
  }

  public get commandFile(): BaseCommand {
    return this.operation.commandFile;
  }

  /**
   * Structure Helpers
   */

  public get itemVariable(): string {
    return camelCase(this.resource.name);
  }
  public get keyVariable(): string {
    return camelCase(this.resource.name + "-key");
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

  hasAttributeGenerator = (
    generator: ValueOf<typeof ResourceAttributeGenerator>
  ): boolean => {
    switch (this.operation.operationSubType) {
      case OPERATION_SUB_TYPE.CREATE_ONE:
        return this.resource.hasCreateGenerator(generator);
      case OPERATION_SUB_TYPE.READ_ONE:
        return this.resource.hasReadGenerator(generator);
      case OPERATION_SUB_TYPE.UPDATE_ONE:
        return this.resource.hasUpdateGenerator(generator);
      case OPERATION_SUB_TYPE.DELETE_ONE:
        return this.resource.hasDeleteGenerator(generator);
      case OPERATION_SUB_TYPE.IMPORT_ONE:
        return this.resource.hasCreateGenerator(generator);
      default:
        throw new Error(
          `Unsupported operation type: ${this.operation.operationSubType}`
        );
    }
  };

  getAttributeGenerator = (
    attribute: ResourceAttribute
  ): ValueOf<typeof ResourceAttributeGenerator> => {
    switch (this.operation.operationSubType) {
      case OPERATION_SUB_TYPE.CREATE_ONE:
        return attribute.createGenerator;
      case OPERATION_SUB_TYPE.READ_ONE:
        return attribute.readGenerator;
      case OPERATION_SUB_TYPE.UPDATE_ONE:
        return attribute.updateGenerator;
      case OPERATION_SUB_TYPE.DELETE_ONE:
        return attribute.deleteGenerator;
      case OPERATION_SUB_TYPE.IMPORT_ONE:
        return attribute.createGenerator;
      default:
        throw new Error(
          `Unsupported operation type: ${this.operation.operationSubType}`
        );
    }
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
          `${attribute.shortName}: "${this.resource.versionStrategy.currentVersion}",`
        );
        break;
      default:
        throw new Error(`Unknown generator: ${generator}`);
    }
  };

  preSynthesize() {
    super.preSynthesize();
  }
}
