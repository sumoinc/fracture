import { join } from "path";
import { ValueOf } from "type-fest";
import { FractureComponent } from "../../../core";
import { AccessPattern } from "../../../core/access-pattern";
import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Operation, OPERATION_SUB_TYPE } from "../../../core/operation";
import { Resource } from "../../../core/resource";
import { ResourceAttributeGenerator } from "../../../core/resource-attribute";
import { Service } from "../../../core/service";
import { Structure } from "../../../core/structure";
import { DynaliteSupport } from "../../../dynamodb/dynalite-support";
import { TypeScriptSource } from "../typescript-source";

export class DynamoCommand extends FractureComponent {
  public readonly operation: Operation;

  constructor(operation: Operation) {
    super(operation.fracture);

    this.operation = operation;
  }

  public build() {
    this.writeCommand();
    this.writeTest();
  }

  public writeCommand = () => {
    const tsFile = new TypeScriptSource(
      this,
      join(this.service.ts.dynamoCommandDir, `${this.operation.name}.ts`)
    );

    const responseType =
      this.operation.operationSubType === OPERATION_SUB_TYPE.LIST
        ? this.service.ts.listResponseTypeName
        : this.service.ts.responseTypeName;

    /***************************************************************************
     *  IMPORTS
     **************************************************************************/

    tsFile.lines([
      `import { DynamoDBClient } from "@aws-sdk/client-dynamodb";`,
      `import { DynamoDBDocumentClient, ${this.dynamoCommandName} } from "@aws-sdk/lib-dynamodb";`,
    ]);

    if (this.inputStructure.hasGenerator(ResourceAttributeGenerator.GUID)) {
      tsFile.line(`import { v4 as uuidv4 } from "uuid";`);
    }

    tsFile.open(`import {`);
    tsFile.line("Error,");
    tsFile.line(this.inputStructure.ts.publicInterfaceName + ",");
    tsFile.line(this.outputStructure.ts.publicInterfaceName + ",");
    tsFile.line(responseType + ",");
    tsFile.close(`} from "${this.service.ts.typeFile.pathFrom(tsFile)}";`);
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
      `${this.inputName}: ${this.inputStructure.ts.publicInterfaceName}`
    );
    tsFile.close(
      `): Promise<${responseType}<${this.outputStructure.ts.publicInterfaceName}>> => {`
    );
    tsFile.open("");
    tsFile.line("");

    tsFile.comments([
      `An error container in case we encounter problems along the way.`,
    ]);
    tsFile.line(`const errors = [] as Error[];`);
    tsFile.line("");

    tsFile.comments([`Assume things will go well (until they don't).`]);
    tsFile.line(`let status = 200;`);
    tsFile.line("");

    /***************************************************************************
     *
     * UNWRAP INPUT VALUES
     *
     * Loop over all the inputs and unwrap them into simple variables. Then
     * convert those values into their short format.
     *
     **************************************************************************/

    tsFile.comments([`Unwrap external inputs.`]);
    tsFile.open(`const {`);
    this.inputStructure.publicAttributes.forEach((a) => {
      tsFile.line(`${a.ts.attributeName},`);
    });
    tsFile.close(`} = ${this.inputName};`);
    tsFile.line("");

    this.inputStructure.publicAttributes
      // skip items with the same public and private names
      .filter((a) => {
        return a.ts.attributeShortName !== a.ts.attributeName;
      })
      .forEach((a) => {
        tsFile.line(
          `const ${a.ts.attributeShortName} = ${a.ts.attributeName};`
        );
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

    tsFile.comments([`Generate needed values.`]);
    this.inputStructure.generatedAttributes.forEach((a) => {
      tsFile.line(
        `const ${a.ts.attributeShortName} = ${a.ts.generationSource(
          this.operation
        )};`
      );
    });
    tsFile.line("");

    /***************************************************************************
     *
     * DYNAMO COMMAND - OPEN
     *
     * Open the command and aupply common information like the table name.
     * We don't use the result for create statesments since we already have all
     * the values. We just made them!
     *
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE) {
      tsFile.open(`await dynamo.send(`);
    } else {
      tsFile.open(`const result = await dynamo.send(`);
    }
    tsFile.open(`new ${this.dynamoCommandName}({`);
    tsFile.line(`TableName: "${this.service.dynamoTable.name}",`);

    /***************************************************************************
     *
     * Create new item
     *
     * When creating a new item, we need to feed the entire item into the
     * dynamodb PutItem command.
     *
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE) {
      tsFile.open(`Item: {`);
      this.inputStructure.itemAttributes.forEach((a) => {
        tsFile.line(`${a.ts.attributeShortName},`);
      });
      tsFile.close(`},`);
    }

    /***************************************************************************
     *
     * Update Existing item
     *
     * When updating an item, we need to alias all names and values and use an
     * expression for the update.
     *
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE) {
      const updateExpression = this.inputStructure.itemAttributes
        .map((attribute) => {
          return `#${attribute.ts.attributeShortName} = :${attribute.ts.attributeShortName}`;
        })
        .join(", ");
      tsFile.line(`UpdateExpression: "set ${updateExpression}",`);
      tsFile.open(`ExpressionAttributeValues: {`);
      this.inputStructure.itemAttributes.forEach((attribute) => {
        tsFile.line(
          `":${attribute.ts.attributeShortName}": ${attribute.ts.attributeShortName},`
        );
      });
      tsFile.close(`},`);
      tsFile.open(`ExpressionAttributeNames: {`);
      this.inputStructure.itemAttributes.forEach((attribute) => {
        tsFile.line(
          `"#${attribute.ts.attributeShortName}": "${attribute.ts.attributeShortName}",`
        );
      });
      tsFile.close(`},`);
    }

    /***************************************************************************
     *
     * List Items
     *
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.LIST) {
      tsFile.line(`IndexName: "${this.lookupAccessPattern.dynamoGsi.name}",`);
      // KeyConditionExpression: "Season = :s and Episode > :e",
      tsFile.line(
        `KeyConditionExpression: "#${this.lookupAccessPattern.pkAttribute.ts.attributeShortName} = :${this.lookupAccessPattern.pkAttribute.ts.attributeShortName} and begins_with(#${this.lookupAccessPattern.skAttribute.ts.attributeShortName}, :${this.lookupAccessPattern.skAttribute.ts.attributeShortName})",`
      );
      tsFile.open(`ExpressionAttributeValues: {`);
      tsFile.line(
        `":${this.lookupAccessPattern.pkAttribute.ts.attributeShortName}": ${this.lookupAccessPattern.pkAttribute.ts.attributeShortName},`
      );
      tsFile.line(
        `":${this.lookupAccessPattern.skAttribute.ts.attributeShortName}": ${this.lookupAccessPattern.skAttribute.ts.attributeShortName},`
      );
      tsFile.close(`},`);
      tsFile.open(`ExpressionAttributeNames: {`);
      tsFile.line(
        `"#${this.lookupAccessPattern.pkAttribute.ts.attributeShortName}": "${this.lookupAccessPattern.pkAttribute.ts.attributeShortName}",`
      );
      tsFile.line(
        `"#${this.lookupAccessPattern.skAttribute.ts.attributeShortName}": "${this.lookupAccessPattern.skAttribute.ts.attributeShortName}",`
      );
      tsFile.close(`},`);
    }

    /***************************************************************************
     *
     * Write Key - Certain operations require the pk and sk.
     *
     **************************************************************************/

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

    /***************************************************************************
     *
     * Return Values
     *
     * When deleting and item we want to old values (before delete).
     * When Updating an item, we want the new values.
     *
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE) {
      tsFile.line(`ReturnValues: "ALL_OLD",`);
    }

    if (this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE) {
      tsFile.line(`ReturnValues: "ALL_NEW",`);
    }
    /***************************************************************************
     *
     * Metrics
     *
     * We always want capacity metrics.
     * Item colelction metrics only matter on mutations.
     *
     **************************************************************************/

    // return some statistics (might remove this later)
    tsFile.line(`ReturnConsumedCapacity: "INDEXES",`);
    if (
      this.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE ||
      this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE ||
      this.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE
    ) {
      tsFile.line(`ReturnItemCollectionMetrics: "SIZE",`);
    }

    /***************************************************************************
     *
     * DYNAMO COMMAND - CLOSE
     *
     * Close the args, then the send command
     *
     **************************************************************************/

    tsFile.close(`})`);
    tsFile.close(`);`);
    tsFile.line("");

    /***************************************************************************
     *  CLOSE FUNCTION - create
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE) {
      tsFile.comments([`Expand/comnvert data to output format.`]);
      tsFile.open(`const data = {`);
      this.outputStructure.publicAttributes.forEach((a) => {
        tsFile.line(`${a.ts.attributeName}: ${a.ts.attributeShortName},`);
      });
      tsFile.close(`};`);
      tsFile.line("");
    }

    /***************************************************************************
     *  CLOSE FUNCTION - read
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.READ_ONE) {
      // data
      tsFile.comments([`Expand/comnvert data to output format.`]);
      tsFile.open(`const data = (result.Item)`);
      tsFile.open(`? {`);
      this.outputStructure.publicAttributes.forEach((a) => {
        tsFile.line(
          `${a.ts.attributeName}: result.Item.${a.ts.attributeShortName},`
        );
      });
      tsFile.close(`} : undefined;`);
      tsFile.close("");
      tsFile.line("");

      // errors
      tsFile.comments([`Log error if no records found.`]);
      tsFile.open(`if (!result.Item) {`);
      tsFile.line(`status = 404;`);
      tsFile.open(`errors.push({ `);
      tsFile.line(`code: 12345,`);
      tsFile.line(`source: "TODO",`);
      tsFile.line(`message: "TODO - Item not found based on inputs.",`);
      tsFile.line(`detail: "TODO",`);
      tsFile.close(`})`);
      tsFile.close(`}`);
      tsFile.line("");
    }

    /***************************************************************************
     *  CLOSE FUNCTION - update
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE) {
      tsFile.comments([`Expand/comnvert data to output format.`]);
      tsFile.open(`const data = (result.Attributes)`);
      tsFile.open(`? {`);
      this.outputStructure.publicAttributes.forEach((a) => {
        tsFile.line(
          `${a.ts.attributeName}: result.Attributes.${a.ts.attributeShortName},`
        );
      });
      tsFile.close(`} : undefined;`);
      tsFile.close("");
      tsFile.line("");

      tsFile.comments([`Log error if no records found.`]);
      tsFile.open(`if (!result.Attributes) {`);
      tsFile.line(`status = 404;`);
      tsFile.open(`errors.push({ `);
      tsFile.line(`code: 12345,`);
      tsFile.line(`source: "TODO",`);
      tsFile.line(`message: "TODO - Attributes not found based on inputs.",`);
      tsFile.line(`detail: "TODO",`);
      tsFile.close(`})`);
      tsFile.close(`}`);
      tsFile.line("");
    }

    /***************************************************************************
     *  CLOSE FUNCTION - delete
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE) {
      tsFile.open(`const data = result.Attributes`);
      tsFile.open(`? {`);
      this.outputStructure.publicAttributes.forEach((a) => {
        tsFile.line(
          `${a.ts.attributeName}: result.Attributes.${a.ts.attributeShortName},`
        );
      });
      tsFile.close(`} : undefined;`);
      tsFile.close("");
      tsFile.line("");

      tsFile.comments([`Log error if no records found.`]);
      tsFile.open(`if (!result.Attributes) {`);
      tsFile.line(`status = 404;`);
      tsFile.open(`errors.push({ `);
      tsFile.line(`code: 12345,`);
      tsFile.line(`source: "TODO",`);
      tsFile.line(`message: "TODO - Attributes not found based on inputs.",`);
      tsFile.line(`detail: "TODO",`);
      tsFile.close(`})`);
      tsFile.close(`}`);
      tsFile.line("");
    }

    /***************************************************************************
     *  CLOSE FUNCTION - list
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.LIST) {
      tsFile.open(`const data = result.Items`);
      tsFile.open(`? result.Items.map((item) => {`);
      tsFile.open("");
      tsFile.open("return {");
      this.outputStructure.publicAttributes.forEach((a) => {
        tsFile.line(`${a.ts.attributeName}: item.${a.ts.attributeShortName},`);
      });
      tsFile.close("};");
      tsFile.close(`}) : [];`);
      tsFile.close("");
      tsFile.close("");
      tsFile.line("");
    }

    tsFile.comments([`Return result.`]);
    tsFile.open(`return {`);
    tsFile.line(`data,`);
    tsFile.line(`errors,`);
    tsFile.line(`status,`);
    tsFile.close(`};`);
    tsFile.close(`};`);
    tsFile.line("");
  };

  public writeTest = () => {
    const tsTest = new TypeScriptSource(
      this,
      join(
        this.service.ts.outdir,
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
      `import { ${this.createOperation.tsDynamoCommand.functionName} } from "./${this.createOperation.name}";`
    );
    if (
      this.createOperation.tsDynamoCommand.functionName !== this.functionName
    ) {
      tsTest.line(
        `import { ${this.functionName} } from "./${this.operation.name}";`
      );
    }
    tsTest.open(`import {`);
    tsTest.line(this.inputStructure.ts.publicInterfaceName + ",");
    tsTest.close(`} from "${this.service.ts.typeFile.pathFrom(tsTest)}";`);
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
        `const fixture : ${this.inputStructure.ts.publicInterfaceName} = {`
      );
      this.inputStructure.publicAttributes.forEach((a) => {
        tsTest.line(`${a.ts.attributeName}: "foo",`);
      });
      tsTest.close(`};`);
      tsTest.line(
        `const { data, errors, status } = await ${this.functionName}(fixture);`
      );
      tsTest.line(`expect(data).toBeTruthy();`);
      tsTest.line(`expect(errors.length).toBe(0);`);
      tsTest.line(`expect(status).toBe(200);`);
    }

    /***************************************************************************
     *  READ TEST
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.READ_ONE) {
      // create some test data
      this.writeSeedData(tsTest);
      // run test
      tsTest.open(
        `const fixture : ${this.inputStructure.ts.publicInterfaceName} = {`
      );
      this.inputStructure.publicAttributes.forEach((a) => {
        tsTest.line(
          `${a.ts.attributeName}: seedData.data.${a.ts.attributeName},`
        );
      });
      tsTest.close(`};`);
      tsTest.line(
        `const { data, errors, status } = await ${this.functionName}(fixture);`
      );

      tsTest.line(`expect(data).toBeTruthy();`);
      tsTest.line(`expect(errors.length).toBe(0);`);
      tsTest.line(`expect(status).toBe(200);`);
    }

    /***************************************************************************
     *  UPDATE TEST
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE) {
      // create some test data
      this.writeSeedData(tsTest);
      tsTest.open(
        `const fixture : ${this.inputStructure.ts.publicInterfaceName} = {`
      );
      tsTest.line(`id: seedData.data.id,`);
      this.inputStructure.publicAttributes
        .filter((a) => a.name !== "id")
        .forEach((a) => {
          tsTest.line(`${a.ts.attributeName}: "bar",`);
        });
      tsTest.close(`};`);
      tsTest.line(
        `const { data, errors, status } = await ${this.functionName}(fixture);`
      );
      tsTest.line(`expect(data).toBeTruthy();`);
      tsTest.line(`expect(errors.length).toBe(0);`);
      tsTest.line(`expect(status).toBe(200);`);
    }

    /***************************************************************************
     *  DELETE TEST
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE) {
      // create some test data
      this.writeSeedData(tsTest);
      tsTest.open(
        `const fixture : ${this.inputStructure.ts.publicInterfaceName} = {`
      );
      tsTest.line(`id: seedData.data.id,`);
      tsTest.close(`};`);
      tsTest.line(
        `const { data, errors, status } = await ${this.functionName}(fixture);`
      );
      tsTest.line(`expect(data).toBeTruthy();`);
      tsTest.line(`expect(errors.length).toBe(0);`);
      tsTest.line(`expect(status).toBe(200);`);
    }

    /***************************************************************************
     *  LIST TEST
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.LIST) {
      // create some test data
      this.writeSeedData(tsTest);
      tsTest.open(
        `const fixture : ${this.inputStructure.ts.publicInterfaceName} = {`
      );
      tsTest.line(`lookupText: 'f',`);
      tsTest.close(`};`);
      tsTest.line(
        `const { data, errors, status } = await ${this.functionName}(fixture);`
      );
      tsTest.line(`console.log(data);`);
      tsTest.line(`expect(data).toBeTruthy();`);
      tsTest.line(`expect(errors.length).toBe(0);`);
      tsTest.line(`expect(status).toBe(200);`);
    }

    /***************************************************************************
     *  CLOSE TEST
     **************************************************************************/

    tsTest.close(`})`);
    tsTest.line("");
  };

  /**
   * determine which dynamo command we will need for this operation.
   */
  public get dynamoCommandName(): string {
    switch (this.operation.operationSubType) {
      case OPERATION_SUB_TYPE.CREATE_ONE:
      case OPERATION_SUB_TYPE.IMPORT_ONE:
      case OPERATION_SUB_TYPE.CREATE_VERSION:
        return "PutCommand";
      case OPERATION_SUB_TYPE.READ_ONE:
      case OPERATION_SUB_TYPE.READ_VERSION:
        return "GetCommand";
      case OPERATION_SUB_TYPE.UPDATE_ONE:
        return "UpdateCommand";
      case OPERATION_SUB_TYPE.DELETE_ONE:
        return "DeleteCommand";
      case OPERATION_SUB_TYPE.LIST:
        return "QueryCommand";
      default:
        throw new Error(
          `Unsupported operation type: ${this.operation.operationSubType}`
        );
    }
  }
  public get dynamoPkName(): string {
    return formatStringByNamingStrategy(
      this.resource.keyAccessPattern.pkAttribute.shortName,
      this.service.namingStrategy.ts.attributeName
    );
  }

  public get dynamoSkName(): string {
    return formatStringByNamingStrategy(
      this.resource.keyAccessPattern.skAttribute.shortName,
      this.service.namingStrategy.ts.attributeName
    );
  }

  /**
   * Gets formatted interface name for this resource
   */
  public get functionName() {
    return formatStringByNamingStrategy(
      this.operation.name,
      this.service.namingStrategy.ts.functionName
    );
  }

  public get inputName() {
    return formatStringByNamingStrategy(
      "input",
      this.service.namingStrategy.ts.functionParameterName
    );
  }

  public writeSeedData(file: TypeScriptSource) {
    file.open(
      `const seedData = await ${this.createOperation.tsDynamoCommand.functionName}({`
    );
    this.createOperation.inputStructure.publicAttributes.forEach((a) => {
      file.line(`${a.ts.attributeName}: "foo",`);
    });
    file.close(`});`);
    file.line("");

    file.open(`if (!seedData.data) {`);
    file.line(`throw new Error("Error creating seed data.");`);
    file.close(`};`);
    file.line("");
  }

  public get operationSubType(): ValueOf<typeof OPERATION_SUB_TYPE> {
    return this.operation.operationSubType;
  }

  public get resource(): Resource {
    return this.operation.resource;
  }

  public get service(): Service {
    return this.resource.service;
  }

  public get inputStructure(): Structure {
    return this.operation.inputStructure;
  }

  public get outputStructure(): Structure {
    return this.operation.outputStructure;
  }

  public get keyAccessPattern(): AccessPattern {
    return this.resource.keyAccessPattern;
  }

  public get lookupAccessPattern(): AccessPattern {
    return this.resource.lookupAccessPattern;
  }

  public get createOperation(): Operation {
    return this.keyAccessPattern.createOperation;
  }

  public get readOperation(): Operation {
    return this.keyAccessPattern.readOperation;
  }

  public get updateOperation(): Operation {
    return this.keyAccessPattern.updateOperation;
  }

  public get deleteOperation(): Operation {
    return this.keyAccessPattern.deleteOperation;
  }
}
