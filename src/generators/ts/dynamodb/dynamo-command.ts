import { join } from "path";
import { ValueOf } from "type-fest";
import { FractureComponent } from "../../../core";
import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Operation, OPERATION_SUB_TYPE } from "../../../core/operation";
import { Resource } from "../../../core/resource";
import { Service } from "../../../core/service";
import { TypescriptOperation } from "../typescript-operation";
import { TypescriptResource } from "../typescript-resource";
import { TypescriptService } from "../typescript-service";
import { TypeScriptSource } from "../typescript-source";
import { TypescriptStructure } from "../typescript-structure";

export class DynamoCommand extends FractureComponent {
  public readonly tsOperation: TypescriptOperation;
  public readonly tsFile: TypeScriptSource;

  constructor(tsOperation: TypescriptOperation) {
    super(tsOperation.fracture);

    this.tsOperation = tsOperation;

    /*
    console.log(
      this.service.name,
      this.resource.name,
      `${this.operation.name}.ts`
    );
    */

    this.tsFile = new TypeScriptSource(
      this,
      join(
        this.tsService.outdir,
        "dynamodb",
        "commands",
        `${this.operation.name}.ts`
      )
    );

    //const { inputStructure } = this.operation;
    // const { privateAttributes, generatedAttributes, publicAttributes } =
    //   inputStructure;

    /***************************************************************************
     *  IMPORTS
     **************************************************************************/

    this.tsFile.lines([
      `import { DynamoDBClient } from "@aws-sdk/client-dynamodb";`,
      `import { DynamoDBDocumentClient, ${this.dynamoCommandName} } from "@aws-sdk/lib-dynamodb";`,
      //`import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";`,
    ]);

    if (this.operation.isGuidGenerator) {
      this.tsFile.line(`import { v4 as uuidv4 } from "uuid";`);
    }

    this.tsFile.open(`import {`);
    this.tsFile.line(this.tsInputStructure.publicInterfaceName + ",");
    this.tsFile.line(this.tsOutputStructure.publicInterfaceName + ",");
    this.tsFile.line(this.tsService.responseTypeName + ",");
    this.tsFile.line(this.tsInputStructure.privateInterfaceName + ",");
    this.tsFile.close(
      `} from "${this.tsService.typeFile.pathFrom(this.tsFile)}";`
    );
    this.tsFile.line("");

    /***************************************************************************
     *  CLIENT
     **************************************************************************/

    this.tsFile.lines([
      `const client = new DynamoDBClient({});`,
      `const dynamo = DynamoDBDocumentClient.from(client);`,
      ``,
    ]);

    /***************************************************************************
     *  OPEN FUNCTION
     **************************************************************************/

    this.tsFile.open(`export const ${this.functionName} = async (`);
    this.tsFile.line(
      `${this.inputName}: Required<${this.tsInputStructure.publicInterfaceName}>`
    );
    this.tsFile.close(
      `): Promise<${this.tsService.responseTypeName}<${this.tsOutputStructure.publicInterfaceName}>> => {`
    );
    this.tsFile.open("");
    this.tsFile.line("");

    /***************************************************************************
     *  UNWRAP INPUT
     **************************************************************************/

    this.tsFile.open(`const {`);
    this.tsInputStructure.publicAttributes.forEach((a) => {
      this.tsFile.line(`${a.attributeName},`);
    });
    this.tsFile.close(`} = ${this.inputName};`);
    this.tsFile.line("");

    /***************************************************************************
     *  DYNAMO INPUT
     **************************************************************************/

    // line up values
    this.tsInputStructure.privateAttributes
      // skip items with the same public and private names
      .filter((attribute) => {
        return attribute.attributeShortName !== attribute.attributeSource;
      })
      .forEach((attribute) => {
        const p = attribute.attributeSource ? "" : "// ";
        this.tsFile.line(
          `${p}const ${attribute.attributeShortName} = ${attribute.attributeSource};`
        );
      });
    this.tsFile.line("");

    this.tsFile.open(`const result = await dynamo.send(`);
    this.tsFile.open(`new ${this.dynamoCommandName}({`);
    this.tsFile.line(`TableName: "${this.service.options.dynamoTable.name}",`);

    // PUT NEW ITEM
    if (
      this.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE ||
      this.operationSubType === OPERATION_SUB_TYPE.IMPORT_ONE
    ) {
      this.tsFile.open(`Item: {`);
      this.tsInputStructure.privateAttributes.forEach((attribute) => {
        this.tsFile.line(`${attribute.attributeShortName},`);
      });
      this.tsFile.close(`} as ${this.tsInputStructure.privateInterfaceName},`);
    }

    // UPDATE OPERATIONS
    if (
      this.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE ||
      this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE
    ) {
      const updateExpression = this.tsInputStructure.privateAttributes
        .map((attribute) => {
          return `#${attribute.attributeShortName} = :${attribute.attributeShortName}`;
        })
        .join(", ");
      this.tsFile.line(`UpdateExpression: "set ${updateExpression}",`);
      this.tsFile.open(`ExpressionAttributeValues: {`);
      this.tsInputStructure.privateAttributes.forEach((attribute) => {
        this.tsFile.line(
          `":${attribute.attributeShortName}": ${attribute.attributeShortName},`
        );
      });
      this.tsFile.close(`},`);
      this.tsFile.open(`ExpressionAttributeNames: {`);
      this.tsInputStructure.privateAttributes.forEach((attribute) => {
        this.tsFile.line(
          `"#${attribute.attributeShortName}": "${attribute.attributeShortName}",`
        );
      });
      this.tsFile.close(`},`);
    }

    // OPERATIONS REQUIRING A KEY
    if (
      this.operationSubType === OPERATION_SUB_TYPE.READ_ONE ||
      this.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE ||
      this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE
    ) {
      this.tsFile.open(`Key: {`);
      this.tsFile.line(`${this.dynamoPkName},`);
      this.tsFile.line(`${this.dynamoSkName},`);
      this.tsFile.close(`},`);
    }

    this.tsFile.close(`})`);
    this.tsFile.close(`);`);
    this.tsFile.line("");

    /***************************************************************************
     *  CLOSE FUNCTION
     **************************************************************************/

    // this.tsFile.line(`return item as ${this.tsResource.interfaceName};`);
    this.tsFile.close(`};`);
  }

  /**
   * determine which dynamo command we will need for this operation.
   */
  public get dynamoCommandName(): string {
    switch (this.operation.options.operationSubType) {
      case OPERATION_SUB_TYPE.CREATE_ONE:
        return "PutCommand";
      case OPERATION_SUB_TYPE.READ_ONE:
        return "GetCommand";
      case OPERATION_SUB_TYPE.UPDATE_ONE:
        return "UpdateCommand";
      case OPERATION_SUB_TYPE.DELETE_ONE:
        return "UpdateCommand";
      case OPERATION_SUB_TYPE.IMPORT_ONE:
        return "PutCommand";
      default:
        throw new Error(
          `Unsupported operation type: ${this.operation.options.operationSubType}`
        );
    }
  }
  public get dynamoPkName(): string {
    return formatStringByNamingStrategy(
      this.resource.keyAccessPattern.pkAttribute.options.shortName,
      this.fracture.options.namingStrategy.ts.attributeName
    );
  }

  public get dynamoSkName(): string {
    return formatStringByNamingStrategy(
      this.resource.keyAccessPattern.skAttribute.options.shortName,
      this.fracture.options.namingStrategy.ts.attributeName
    );
  }

  /**
   * Gets formatted interface name for this resource
   */
  public get functionName() {
    return formatStringByNamingStrategy(
      this.operation.name,
      this.fracture.options.namingStrategy.ts.functionName
    );
  }

  public get inputName() {
    return formatStringByNamingStrategy(
      "input",
      this.fracture.options.namingStrategy.ts.functionParameterName
    );
  }

  public get operation(): Operation {
    return this.tsOperation.operation;
  }

  public get operationSubType(): ValueOf<typeof OPERATION_SUB_TYPE> {
    return this.operation.options.operationSubType;
  }

  public get resource(): Resource {
    return this.operation.resource;
  }

  public get service(): Service {
    return this.resource.service;
  }

  public get tsInputStructure(): TypescriptStructure {
    return this.tsOperation.tsInputStructure;
  }
  public get tsOutputStructure(): TypescriptStructure {
    return this.tsOperation.tsOutputStructure;
  }

  public get tsResource(): TypescriptResource {
    return this.tsOperation.tsResource;
  }

  public get tsService(): TypescriptService {
    return this.tsResource.tsService;
  }
}
