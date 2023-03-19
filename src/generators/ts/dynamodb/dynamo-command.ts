import { join } from "path";
import { ValueOf } from "type-fest";
import { FractureComponent } from "../../../core";
import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Operation, OPERATION_SUB_TYPE } from "../../../core/operation";
import { Resource } from "../../../core/resource";
import { ResourceAttributeGenerator } from "../../../core/resource-attribute";
import { Service } from "../../../core/service";
import { DynaliteSupport } from "../../../dynamodb/dynalite-support";
import { TypescriptOperation } from "../typescript-operation";
import { TypescriptResource } from "../typescript-resource";
import { TypescriptService } from "../typescript-service";
import { TypeScriptSource } from "../typescript-source";
import { TypescriptStructure } from "../typescript-structure";

export class DynamoCommand extends FractureComponent {
  public readonly tsOperation: TypescriptOperation;

  constructor(tsOperation: TypescriptOperation) {
    super(tsOperation.fracture);

    this.tsOperation = tsOperation;
  }

  public writeCommand = () => {
    const tsFile = new TypeScriptSource(
      this,
      join(
        this.tsService.outdir,
        "dynamodb",
        "commands",
        `${this.operation.name}.ts`
      )
    );

    /***************************************************************************
     *  IMPORTS
     **************************************************************************/

    tsFile.lines([
      `import { DynamoDBClient } from "@aws-sdk/client-dynamodb";`,
      `import { DynamoDBDocumentClient, ${this.dynamoCommandName} } from "@aws-sdk/lib-dynamodb";`,
    ]);

    if (
      this.tsInputStructure.structure.hasGenerator(
        ResourceAttributeGenerator.GUID
      )
    ) {
      tsFile.line(`import { v4 as uuidv4 } from "uuid";`);
    }

    tsFile.open(`import {`);
    tsFile.line(this.tsInputStructure.publicInterfaceName + ",");
    tsFile.line(this.tsOutputStructure.publicInterfaceName + ",");
    tsFile.line(this.tsService.responseTypeName + ",");
    tsFile.close(`} from "${this.tsService.typeFile.pathFrom(tsFile)}";`);
    tsFile.line("");

    /***************************************************************************
     *
     * CLIENT
     *
     * Use the dynalite support to create the client. This builds a testable
     * client required when building Jest unit tests.
     *
     **************************************************************************/

    DynaliteSupport.writeDynamoClient(tsFile);

    /***************************************************************************
     *  OPEN FUNCTION
     **************************************************************************/

    tsFile.open(`export const ${this.functionName} = async (`);
    tsFile.line(
      `${this.inputName}: Required<${this.tsInputStructure.publicInterfaceName}>`
    );
    tsFile.close(
      `): Promise<${this.tsService.responseTypeName}<${this.tsOutputStructure.publicInterfaceName}>> => {`
    );
    tsFile.open("");
    tsFile.line("");

    /***************************************************************************
     *
     * UNWRAP INPUT VALUES
     *
     * Loop over all the inputs and unwrap them into simple variables. Then
     * convert those values into their short format.
     *
     **************************************************************************/

    tsFile.open(`const {`);
    this.tsInputStructure.tsPublicAttributes.forEach((a) => {
      tsFile.line(`${a.attributeName},`);
    });
    tsFile.close(`} = ${this.inputName};`);
    tsFile.line("");

    this.tsInputStructure.tsPublicAttributes
      // skip items with the same public and private names
      .filter((a) => {
        return a.attributeShortName !== a.attributeName;
      })
      .forEach((a) => {
        tsFile.line(`const ${a.attributeShortName} = ${a.attributeName};`);
      });
    tsFile.line("");

    /***************************************************************************
     *
     * GENERATED VALUES
     *
     * Loop over anything that needs to be generated and generate values
     * for them.
     *
     **************************************************************************/

    this.tsInputStructure.tsGeneratedAttributes.forEach((a) => {
      tsFile.line(
        `const ${a.attributeShortName} = ${a.generationSource(this.operation)};`
      );
    });
    tsFile.line("");

    /***************************************************************************
     *  DYNAMO INPUT
     **************************************************************************/

    tsFile.open(`const result = await dynamo.send(`);
    tsFile.open(`new ${this.dynamoCommandName}({`);
    tsFile.line(`TableName: "${this.service.dynamoTable.name}",`);

    // PUT NEW ITEM
    if (this.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE) {
      tsFile.open(`Item: {`);
      this.tsInputStructure.tsItemAttributes.forEach((a) => {
        tsFile.line(`${a.attributeShortName},`);
      });
      tsFile.close(`},`);
    }

    // UPDATE
    if (this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE) {
      const updateExpression = this.tsInputStructure.tsItemAttributes
        .map((attribute) => {
          return `#${attribute.attributeShortName} = :${attribute.attributeShortName}`;
        })
        .join(", ");
      tsFile.line(`UpdateExpression: "set ${updateExpression}",`);
      tsFile.open(`ExpressionAttributeValues: {`);
      this.tsInputStructure.tsItemAttributes.forEach((attribute) => {
        tsFile.line(
          `":${attribute.attributeShortName}": ${attribute.attributeShortName},`
        );
      });
      tsFile.close(`},`);
      tsFile.open(`ExpressionAttributeNames: {`);
      this.tsInputStructure.tsItemAttributes.forEach((attribute) => {
        tsFile.line(
          `"#${attribute.attributeShortName}": "${attribute.attributeShortName}",`
        );
      });
      tsFile.close(`},`);
    }

    // OPERATIONS REQUIRING A KEY
    if (
      this.operationSubType === OPERATION_SUB_TYPE.READ_ONE ||
      this.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE ||
      this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE
    ) {
      tsFile.open(`Key: {`);
      tsFile.line(`${this.dynamoPkName},`);
      tsFile.line(`${this.dynamoSkName},`);
      tsFile.close(`},`);
    }

    // return some statistics (might remove this later)
    tsFile.line(`ReturnConsumedCapacity: "INDEXES",`);
    if (this.operationSubType !== OPERATION_SUB_TYPE.READ_ONE) {
      tsFile.line(`ReturnItemCollectionMetrics: "SIZE",`);
    }

    tsFile.close(`})`);
    tsFile.close(`);`);
    tsFile.line("");

    /***************************************************************************
     *  CLOSE FUNCTION
     **************************************************************************/

    tsFile.line(`console.log(result);`);

    tsFile.open(`return {`);

    /***************************************************************************
     *  CLOSE FUNCTION - create
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE) {
      tsFile.open(`data: {`);
      this.tsOutputStructure.tsPublicAttributes.forEach((a) => {
        tsFile.line(`${a.attributeName}: ${a.attributeShortName},`);
      });
      tsFile.close(`},`);
    }

    /***************************************************************************
     *  CLOSE FUNCTION - read
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.READ_ONE) {
      tsFile.line(`// @ts-ignore`);
      tsFile.open(`data: {`);
      /*
      this.tsOutputStructure.tsPublicAttributes.forEach((a) => {
        tsFile.line(`${a.attributeName}: ${a.attributeShortName},`);
      });
      */
      tsFile.close(`},`);
    }

    /***************************************************************************
     *  CLOSE FUNCTION - update
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE) {
      tsFile.line(`// @ts-ignore`);
      tsFile.open(`data: {`);
      /*
      this.tsOutputStructure.tsPublicAttributes.forEach((a) => {
        tsFile.line(`${a.attributeName}: ${a.attributeShortName},`);
      });
      */
      tsFile.close(`},`);
    }

    /***************************************************************************
     *  CLOSE FUNCTION - delete
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE) {
      tsFile.line(`// @ts-ignore`);
      tsFile.open(`data: {`);
      /*
      this.tsOutputStructure.tsPublicAttributes.forEach((a) => {
        tsFile.line(`${a.attributeName}: ${a.attributeShortName},`);
      });
      */
      tsFile.close(`},`);
    }

    tsFile.line(`errors: [],`);
    tsFile.line(`status: 200,`);
    tsFile.close(`};`);
    tsFile.close(`};`);
  };

  public writeTest = () => {
    const tsTest = new TypeScriptSource(
      this,
      join(
        this.tsService.outdir,
        "dynamodb",
        "commands",
        `${this.operation.name}.spec.ts`
      )
    );
    /***************************************************************************
     *  IMPORTS
     **************************************************************************/
    DynaliteSupport.writeJestImports(tsTest);
    tsTest.line(
      `import { ${this.functionName} } from "./${this.operation.name}.ts";`
    );
    tsTest.open(`import {`);
    tsTest.line(this.tsInputStructure.publicInterfaceName + ",");
    tsTest.close(`} from "${this.tsService.typeFile.pathFrom(tsTest)}";`);
    tsTest.line("");

    /***************************************************************************
     *  CONFIGURE TESTS
     **************************************************************************/

    DynaliteSupport.writeJestConfig(tsTest);
    tsTest.open(`test("Smoke test", async () => {`);

    /***************************************************************************
     *  CREATE TEST
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE) {
      tsTest.open(
        `const fixture : ${this.tsInputStructure.publicInterfaceName} = {`
      );
      this.tsInputStructure.tsPublicAttributes.forEach((a) => {
        tsTest.line(`${a.attributeName}: "foo",`);
      });
      tsTest.close(`};`);
      tsTest.line(`const result = await ${this.functionName}(fixture);`);
      tsTest.line(`const { data, errors, status } = result;`);

      tsTest.line(
        `console.log("${this.functionName}() Result:", JSON.stringify(result, null, 2));`
      );
      tsTest.line(`expect(data).toBeTruthy();`);
      tsTest.line(`expect(errors.length).toBe(0);`);
      tsTest.line(`expect(status).toBe(200);`);
      tsTest.line(`expect(data.name).toBe("foo");`);
    }

    /***************************************************************************
     *  READ TEST
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.READ_ONE) {
      tsTest.open(
        `const fixture : ${this.tsInputStructure.publicInterfaceName} = {`
      );
      this.tsInputStructure.tsPublicAttributes.forEach((a) => {
        tsTest.line(`${a.attributeName}: "foo",`);
      });
      tsTest.close(`};`);
      tsTest.line(`const result = await ${this.functionName}(fixture);`);
      tsTest.line(`const { data, errors, status } = result;`);

      tsTest.line(
        `console.log("${this.functionName}() Result:", JSON.stringify(result, null, 2));`
      );
      tsTest.line(`expect(data).toBeTruthy();`);
      tsTest.line(`expect(errors.length).toBe(0);`);
      tsTest.line(`expect(status).toBe(200);`);
    }

    /***************************************************************************
     *  UPDATE TEST
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE) {
      tsTest.open(
        `const fixture : ${this.tsInputStructure.publicInterfaceName} = {`
      );
      this.tsInputStructure.tsPublicAttributes.forEach((a) => {
        tsTest.line(`${a.attributeName}: "foo",`);
      });
      tsTest.close(`};`);
      tsTest.line(`const result = await ${this.functionName}(fixture);`);
      tsTest.line(`const { data, errors, status } = result;`);

      tsTest.line(
        `console.log("${this.functionName}() Result:", JSON.stringify(result, null, 2));`
      );
      tsTest.line(`expect(data).toBeTruthy();`);
      tsTest.line(`expect(errors.length).toBe(0);`);
      tsTest.line(`expect(status).toBe(200);`);
    }

    /***************************************************************************
     *  DELETE TEST
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE) {
      tsTest.open(
        `const fixture : ${this.tsInputStructure.publicInterfaceName} = {`
      );
      this.tsInputStructure.tsPublicAttributes.forEach((a) => {
        tsTest.line(`${a.attributeName}: "foo",`);
      });
      tsTest.close(`};`);
      tsTest.line(`const result = await ${this.functionName}(fixture);`);
      tsTest.line(`const { data, errors, status } = result;`);

      tsTest.line(
        `console.log("${this.functionName}() Result:", JSON.stringify(result, null, 2));`
      );
      tsTest.line(`expect(data).toBeTruthy();`);
      tsTest.line(`expect(errors.length).toBe(0);`);
      tsTest.line(`expect(status).toBe(200);`);
    }

    tsTest.close(`})`);
    tsTest.line("");
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
