import { join } from "path";
import { ValueOf } from "type-fest";
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
import { TypescriptStructure } from "../typescript-structure";

export class DynamoCommand extends FractureComponent {
  public readonly tsOperation: TypescriptOperation;
  public readonly tsFile: TypeScriptSource;
  public readonly tsTest: TypeScriptSource;

  constructor(tsOperation: TypescriptOperation) {
    super(tsOperation.fracture);

    this.tsOperation = tsOperation;

    this.tsFile = new TypeScriptSource(
      this,
      join(
        this.tsService.outdir,
        "dynamodb",
        "commands",
        `${this.operation.name}.ts`
      )
    );

    this.tsTest = new TypeScriptSource(
      this,
      join(
        this.tsService.outdir,
        "dynamodb",
        "commands",
        `${this.operation.name}.spec.ts`
      )
    );

    // write the command and test
    this.writeCommand();
    this.writeTest();
  }

  private writeCommand = () => {
    /***************************************************************************
     *  IMPORTS
     **************************************************************************/

    this.tsFile.lines([
      `import { DynamoDBClient } from "@aws-sdk/client-dynamodb";`,
      `import { DynamoDBDocumentClient, ${this.dynamoCommandName} } from "@aws-sdk/lib-dynamodb";`,
    ]);

    if (
      this.tsInputStructure.structure.hasGenerator(
        ResourceAttributeGenerator.GUID
      )
    ) {
      this.tsFile.line(`import { v4 as uuidv4 } from "uuid";`);
    }

    this.tsFile.open(`import {`);
    this.tsFile.line(this.tsInputStructure.publicInterfaceName + ",");
    this.tsFile.line(this.tsOutputStructure.publicInterfaceName + ",");
    this.tsFile.line(this.tsService.responseTypeName + ",");
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
     *
     * UNWRAP INPUT VALUES
     *
     * Loop over all the inputs and unwrap them into simple variables. Then
     * convert those values into their short format.
     *
     **************************************************************************/

    this.tsFile.open(`const {`);
    this.tsInputStructure.tsPublicAttributes.forEach((a) => {
      this.tsFile.line(`${a.attributeName},`);
    });
    this.tsFile.close(`} = ${this.inputName};`);
    this.tsFile.line("");

    this.tsInputStructure.tsPublicAttributes
      // skip items with the same public and private names
      .filter((a) => {
        return a.attributeShortName !== a.attributeName;
      })
      .forEach((a) => {
        this.tsFile.line(`const ${a.attributeShortName} = ${a.attributeName};`);
      });
    this.tsFile.line("");

    /***************************************************************************
     *
     * GENERATED VALUES
     *
     * Loop over anything that needs to be generated and generate values
     * for them.
     *
     **************************************************************************/

    this.tsInputStructure.tsGeneratedAttributes.forEach((a) => {
      this.tsFile.line(
        `const ${a.attributeShortName} = ${a.generationSource(this.operation)};`
      );
    });
    this.tsFile.line("");

    /***************************************************************************
     *  DYNAMO INPUT
     **************************************************************************/

    this.tsFile.open(`const result = await dynamo.send(`);
    this.tsFile.open(`new ${this.dynamoCommandName}({`);
    this.tsFile.line(`TableName: "${this.service.dynamoTable.name}",`);

    // PUT NEW ITEM
    if (
      this.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE ||
      this.operationSubType === OPERATION_SUB_TYPE.IMPORT_ONE
    ) {
      this.tsFile.open(`Item: {`);
      this.tsInputStructure.tsItemAttributes.forEach((a) => {
        this.tsFile.line(`${a.attributeShortName},`);
      });
      this.tsFile.close(`},`);
    }

    // UPDATE OPERATIONS
    /*
if (
  this.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE ||
  this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE
) {
  const updateExpression = this.tsInputStructure.attributes
    .map((attribute) => {
      return `#${attribute.attributeShortName} = :${attribute.attributeShortName}`;
    })
    .join(", ");
  this.tsFile.line(`UpdateExpression: "set ${updateExpression}",`);
  this.tsFile.open(`ExpressionAttributeValues: {`);
  this.tsInputStructure.attributes.forEach((attribute) => {
    this.tsFile.line(
      `":${attribute.attributeShortName}": ${attribute.attributeShortName},`
    );
  });
  this.tsFile.close(`},`);
  this.tsFile.open(`ExpressionAttributeNames: {`);
  this.tsInputStructure.attributes.forEach((attribute) => {
    this.tsFile.line(
      `"#${attribute.attributeShortName}": "${attribute.attributeShortName}",`
    );
  });
  this.tsFile.close(`},`);
}*/

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

    this.tsFile.line(`console.log(result);`);

    this.tsFile.open(`return {`);
    this.tsFile.open(`data: {`);
    this.tsOutputStructure.tsPublicAttributes.forEach((a) => {
      this.tsFile.line(`${a.attributeName}: ${a.attributeShortName},`);
    });
    this.tsFile.close(`},`);
    this.tsFile.line(`errors: [],`);
    this.tsFile.line(`status: 200,`);
    this.tsFile.close(`};`);
    this.tsFile.close(`};`);
  };

  private writeTest = () => {
    /***************************************************************************
     *  IMPORTS
     **************************************************************************/
    this.tsTest.line(
      `import { ${this.functionName} } from "./${
        this.tsFile.fileName.split(".")[0]
      }";`
    );
    this.tsTest.open(`import {`);
    this.tsTest.line(this.tsInputStructure.publicInterfaceName + ",");
    this.tsTest.close(
      `} from "${this.tsService.typeFile.pathFrom(this.tsTest)}";`
    );
    this.tsTest.line("");

    /***************************************************************************
     *  SMOKE TEST
     **************************************************************************/

    this.tsTest.open(`test("Smoke test", async () => {`);
    this.tsTest.open(
      `const fixture : ${this.tsInputStructure.publicInterfaceName} = {`
    );
    this.tsInputStructure.tsPublicAttributes.forEach((a) => {
      this.tsTest.line(`${a.attributeName}: 'foo',`);
    });
    this.tsTest.close(`};`);
    this.tsTest.line(`const result = await ${this.functionName}(fixture);`);
    this.tsTest.line(`expect(result).toBeTruthy();`);
    this.tsTest.close(`})`);
    this.tsFile.line("");
  };

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
        return "DeleteCommand";
      case OPERATION_SUB_TYPE.IMPORT_ONE:
        return "PutCommand";
      case OPERATION_SUB_TYPE.LIST:
        return "Query";
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
