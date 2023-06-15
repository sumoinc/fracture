import { join } from "path";
import { ValueOf } from "type-fest";
import { ResourceAttributeGenerator } from "../../../core";
import { AccessPattern } from "../../../core/access-pattern";
import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Operation, OPERATION_SUB_TYPE } from "../../../core/operation";
import { Resource } from "../../../core/resource";
import { Service } from "../../../core/service";
import { Structure } from "../../../core/structure";
import { DynaliteSupport } from "../../../dynamodb";
import { TypeScriptSource } from "../typescript-source";

export class DynamoCommand extends TypeScriptSource {
  public readonly operation: Operation;

  constructor(operation: Operation) {
    super(
      operation,
      join(
        operation.service.srcDir,
        "ts",
        "dynamodb",
        "commands",
        `${operation.name}.ts`
      ),
      {
        readonly: false,
      }
    );

    this.operation = operation;
  }

  preSynthesize(): void {
    /***************************************************************************
     *  IMPORTS
     **************************************************************************/

    this.lines([
      `import { DynamoDBClient } from "@aws-sdk/client-dynamodb";`,
      `import { DynamoDBDocumentClient, ${this.dynamoCommandName} } from "@aws-sdk/lib-dynamodb";`,
    ]);

    if (this.inputStructure.hasGenerator(ResourceAttributeGenerator.GUID)) {
      this.line(`import { v4 as uuidv4 } from "uuid";`);
    }

    this.open(`import {`);
    this.line("Error,");
    this.line(this.inputStructure.tsInterfaceName + ",");
    this.line(this.outputStructure.tsInterfaceName + ",");
    this.line(this.operation.tsResponseTypeName + ",");
    this.close(`} from "${this.service.tsTypes.pathFrom(this)}";`);
    this.line("");

    /***************************************************************************
     *
     * CLIENT
     *
     * Use the dynalite support to create the client. This builds a testable
     * client required when building Jest unit tests.
     *
     **************************************************************************/

    DynaliteSupport.writeDynamoClient(this);

    /***************************************************************************
     *  OPEN FUNCTION
     **************************************************************************/

    this.open(`export const ${this.functionName} = async (`);
    this.line(`${this.inputName}: ${this.inputStructure.tsInterfaceName}`);
    this.close(
      `): Promise<${this.operation.tsResponseTypeName}<${this.outputStructure.tsInterfaceName}>> => {`
    );
    this.open("");
    this.line("");

    this.comments([
      `An error container in case we encounter problems along the way.`,
    ]);
    this.line(`const errors = [] as Error[];`);
    this.line("");

    this.comments([`Assume things will go well (until they don't).`]);
    this.line(`let status = 200;`);
    this.line("");

    /***************************************************************************
     *
     * UNWRAP INPUT VALUES
     *
     * Loop over all the inputs and unwrap them into simple variables. Then
     * convert those values into their short format.
     *
     **************************************************************************/

    this.comments([`Unwrap external inputs.`]);
    this.open(`const {`);
    this.inputStructure.publicAttributes.forEach((attribute) => {
      this.line(`${attribute.tsAttributeName},`);
    });
    this.close(`} = ${this.inputName};`);
    this.line("");

    this.inputStructure.publicAttributes
      // skip items with the same public and private names
      .filter((attribute) => {
        return attribute.tsAttributeShortName !== attribute.tsAttributeName;
      })
      .forEach((attribute) => {
        this.line(
          `const ${attribute.tsAttributeShortName} = ${attribute.tsAttributeName};`
        );
      });
    this.line("");

    /***************************************************************************
     *
     * GENERATED VALUES
     *
     * Loop over anything that needs to be generated and generate values
     * for them.
     *
     **************************************************************************/

    this.comments([`Generate needed values.`]);
    this.inputStructure.generatedAttributes.forEach((attribute) => {
      this.line(
        `const ${
          attribute.tsAttributeShortName
        } = ${attribute.getTsGenerationSource(this.operation)};`
      );
    });
    this.line("");

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
      this.open(`await dynamo.send(`);
    } else {
      this.open(`const result = await dynamo.send(`);
    }
    this.open(`new ${this.dynamoCommandName}({`);
    this.line(`TableName: "${this.service.dynamoTable.name}",`);

    /***************************************************************************
     *
     * Create new item
     *
     * When creating a new item, we need to feed the entire item into the
     * dynamodb PutItem command.
     *
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE) {
      this.open(`Item: {`);
      this.inputStructure.itemAttributes.forEach((attribute) => {
        this.line(`${attribute.tsAttributeShortName},`);
      });
      this.close(`},`);
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
          return `#${attribute.tsAttributeShortName} = :${attribute.tsAttributeShortName}`;
        })
        .join(", ");
      this.line(`UpdateExpression: "set ${updateExpression}",`);
      this.open(`ExpressionAttributeValues: {`);
      this.inputStructure.itemAttributes.forEach((attribute) => {
        this.line(
          `":${attribute.tsAttributeShortName}": ${attribute.tsAttributeShortName},`
        );
      });
      this.close(`},`);
      this.open(`ExpressionAttributeNames: {`);
      this.inputStructure.itemAttributes.forEach((attribute) => {
        this.line(
          `"#${attribute.tsAttributeShortName}": "${attribute.tsAttributeShortName}",`
        );
      });
      this.close(`},`);
    }

    /***************************************************************************
     *
     * List Items
     *
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.LIST) {
      this.line(`IndexName: "${this.lookupAccessPattern.dynamoGsi.name}",`);
      // KeyConditionExpression: "Season = :s and Episode > :e",
      this.line(
        `KeyConditionExpression: "#${this.lookupAccessPattern.pkAttribute.tsAttributeShortName} = :${this.lookupAccessPattern.pkAttribute.tsAttributeShortName} and begins_with(#${this.lookupAccessPattern.skAttribute.tsAttributeShortName}, :${this.lookupAccessPattern.skAttribute.tsAttributeShortName})",`
      );
      this.open(`ExpressionAttributeValues: {`);
      this.line(
        `":${this.lookupAccessPattern.pkAttribute.tsAttributeShortName}": ${this.lookupAccessPattern.pkAttribute.tsAttributeShortName},`
      );
      this.line(
        `":${this.lookupAccessPattern.skAttribute.tsAttributeShortName}": ${this.lookupAccessPattern.skAttribute.tsAttributeShortName},`
      );
      this.close(`},`);
      this.open(`ExpressionAttributeNames: {`);
      this.line(
        `"#${this.lookupAccessPattern.pkAttribute.tsAttributeShortName}": "${this.lookupAccessPattern.pkAttribute.tsAttributeShortName}",`
      );
      this.line(
        `"#${this.lookupAccessPattern.skAttribute.tsAttributeShortName}": "${this.lookupAccessPattern.skAttribute.tsAttributeShortName}",`
      );
      this.close(`},`);
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
      this.open(`Key: {`);
      this.line(`${this.dynamoPkName},`);
      this.line(`${this.dynamoSkName},`);
      this.close(`},`);
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
      this.line(`ReturnValues: "ALL_OLD",`);
    }

    if (this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE) {
      this.line(`ReturnValues: "ALL_NEW",`);
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
    this.line(`ReturnConsumedCapacity: "INDEXES",`);
    if (
      this.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE ||
      this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE ||
      this.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE
    ) {
      this.line(`ReturnItemCollectionMetrics: "SIZE",`);
    }

    /***************************************************************************
     *
     * DYNAMO COMMAND - CLOSE
     *
     * Close the args, then the send command
     *
     **************************************************************************/

    this.close(`})`);
    this.close(`);`);
    this.line("");

    /***************************************************************************
     *  CLOSE FUNCTION - create
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE) {
      this.comments([`Expand/comnvert data to output format.`]);
      this.open(`const data = {`);
      this.outputStructure.publicAttributes.forEach((a) => {
        this.line(`${a.tsAttributeName}: ${a.tsAttributeShortName},`);
      });
      this.close(`};`);
      this.line("");
    }

    /***************************************************************************
     *  CLOSE FUNCTION - read
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.READ_ONE) {
      // data
      this.comments([`Expand/comnvert data to output format.`]);
      this.open(`const data = result.Item`);
      this.open(`? {`);
      this.outputStructure.publicAttributes.forEach((a) => {
        this.line(
          `${a.tsAttributeName}: result.Item.${a.tsAttributeShortName},`
        );
      });
      this.close(`} : undefined;`);
      this.close("");
      this.line("");

      // errors
      this.comments([`Log error if no records found.`]);
      this.open(`if (!result.Item) {`);
      this.line(`status = 404;`);
      this.open(`errors.push({ `);
      this.line(`code: 12345,`);
      this.line(`source: "TODO",`);
      this.line(`message: "TODO - Item not found based on inputs.",`);
      this.line(`detail: "TODO",`);
      this.close(`})`);
      this.close(`}`);
      this.line("");
    }

    /***************************************************************************
     *  CLOSE FUNCTION - update
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE) {
      this.comments([`Expand/comnvert data to output format.`]);
      this.open(`const data = (result.Attributes)`);
      this.open(`? {`);
      this.outputStructure.publicAttributes.forEach((a) => {
        this.line(
          `${a.tsAttributeName}: result.Attributes.${a.tsAttributeShortName},`
        );
      });
      this.close(`} : undefined;`);
      this.close("");
      this.line("");

      this.comments([`Log error if no records found.`]);
      this.open(`if (!result.Attributes) {`);
      this.line(`status = 404;`);
      this.open(`errors.push({ `);
      this.line(`code: 12345,`);
      this.line(`source: "TODO",`);
      this.line(`message: "TODO - Attributes not found based on inputs.",`);
      this.line(`detail: "TODO",`);
      this.close(`})`);
      this.close(`}`);
      this.line("");
    }

    /***************************************************************************
     *  CLOSE FUNCTION - delete
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE) {
      this.open(`const data = result.Attributes`);
      this.open(`? {`);
      this.outputStructure.publicAttributes.forEach((a) => {
        this.line(
          `${a.tsAttributeName}: result.Attributes.${a.tsAttributeShortName},`
        );
      });
      this.close(`} : undefined;`);
      this.close("");
      this.line("");

      this.comments([`Log error if no records found.`]);
      this.open(`if (!result.Attributes) {`);
      this.line(`status = 404;`);
      this.open(`errors.push({ `);
      this.line(`code: 12345,`);
      this.line(`source: "TODO",`);
      this.line(`message: "TODO - Attributes not found based on inputs.",`);
      this.line(`detail: "TODO",`);
      this.close(`})`);
      this.close(`}`);
      this.line("");
    }

    /***************************************************************************
     *  CLOSE FUNCTION - list
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.LIST) {
      this.open(`const data = result.Items`);
      this.open(`? result.Items.map((item) => {`);
      this.open("");
      this.open("return {");
      this.outputStructure.publicAttributes.forEach((a) => {
        this.line(`${a.tsAttributeName}: item.${a.tsAttributeShortName},`);
      });
      this.close("};");
      this.close(`}) : [];`);
      this.close("");
      this.close("");
      this.line("");
    }

    this.comments([`Return result.`]);
    this.open(`return {`);
    this.line(`data,`);
    this.line(`errors,`);
    this.line(`status,`);
    this.close(`};`);
    this.close(`};`);
    this.line("");

    super.preSynthesize();
  }

  // public writeTest = () => {
  //   const tsTest = new TypeScriptSource(
  //     this,
  //     join(
  //       this.service.ts.outdir,
  //       "dynamodb",
  //       "commands",
  //       `${this.operation.name}.spec.ts`
  //     )
  //   );
  //   /***************************************************************************
  //    *  IMPORTS
  //    **************************************************************************/
  //   DynaliteSupport.writeJestImports(tsTest);
  //   tsTest.line(
  //     `import { ${this.createOperation.tsDynamoCommand.functionName} } from "./${this.createOperation.name}";`
  //   );
  //   if (
  //     this.createOperation.tsDynamoCommand.functionName !== this.functionName
  //   ) {
  //     tsTest.line(
  //       `import { ${this.functionName} } from "./${this.operation.name}";`
  //     );
  //   }
  //   tsTest.open(`import {`);
  //   tsTest.line(this.inputStructure.ts.publicInterfaceName + ",");
  //   tsTest.close(`} from "${this.service.ts.typeFile.pathFrom(tsTest)}";`);
  //   tsTest.line("");

  //   /***************************************************************************
  //    *  CONFIGURE TESTS
  //    **************************************************************************/

  //   DynaliteSupport.writeJestConfig(tsTest);
  //   tsTest.open(`test("Smoke test", async () => {`);

  //   /***************************************************************************
  //    *  CREATE TEST
  //    **************************************************************************/

  //   if (this.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE) {
  //     tsTest.open(
  //       `const fixture : ${this.inputStructure.ts.publicInterfaceName} = {`
  //     );
  //     this.inputStructure.publicAttributes.forEach((a) => {
  //       tsTest.line(`${a.tsAttributeName}: "foo",`);
  //     });
  //     tsTest.close(`};`);
  //     tsTest.line(
  //       `const { data, errors, status } = await ${this.functionName}(fixture);`
  //     );
  //     tsTest.line(`expect(data).toBeTruthy();`);
  //     tsTest.line(`expect(errors.length).toBe(0);`);
  //     tsTest.line(`expect(status).toBe(200);`);
  //   }

  //   /***************************************************************************
  //    *  READ TEST
  //    **************************************************************************/

  //   if (this.operationSubType === OPERATION_SUB_TYPE.READ_ONE) {
  //     // create some test data
  //     this.writeSeedData(tsTest);
  //     // run test
  //     tsTest.open(
  //       `const fixture : ${this.inputStructure.ts.publicInterfaceName} = {`
  //     );
  //     this.inputStructure.publicAttributes.forEach((a) => {
  //       tsTest.line(
  //         `${a.tsAttributeName}: seedData.data.${a.tsAttributeName},`
  //       );
  //     });
  //     tsTest.close(`};`);
  //     tsTest.line(
  //       `const { data, errors, status } = await ${this.functionName}(fixture);`
  //     );

  //     tsTest.line(`expect(data).toBeTruthy();`);
  //     tsTest.line(`expect(errors.length).toBe(0);`);
  //     tsTest.line(`expect(status).toBe(200);`);
  //   }

  //   /***************************************************************************
  //    *  UPDATE TEST
  //    **************************************************************************/

  //   if (this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE) {
  //     // create some test data
  //     this.writeSeedData(tsTest);
  //     tsTest.open(
  //       `const fixture : ${this.inputStructure.ts.publicInterfaceName} = {`
  //     );
  //     tsTest.line(`id: seedData.data.id,`);
  //     this.inputStructure.publicAttributes
  //       .filter((a) => a.name !== "id")
  //       .forEach((a) => {
  //         tsTest.line(`${a.tsAttributeName}: "bar",`);
  //       });
  //     tsTest.close(`};`);
  //     tsTest.line(
  //       `const { data, errors, status } = await ${this.functionName}(fixture);`
  //     );
  //     tsTest.line(`expect(data).toBeTruthy();`);
  //     tsTest.line(`expect(errors.length).toBe(0);`);
  //     tsTest.line(`expect(status).toBe(200);`);
  //   }

  //   /***************************************************************************
  //    *  DELETE TEST
  //    **************************************************************************/

  //   if (this.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE) {
  //     // create some test data
  //     this.writeSeedData(tsTest);
  //     tsTest.open(
  //       `const fixture : ${this.inputStructure.ts.publicInterfaceName} = {`
  //     );
  //     tsTest.line(`id: seedData.data.id,`);
  //     tsTest.close(`};`);
  //     tsTest.line(
  //       `const { data, errors, status } = await ${this.functionName}(fixture);`
  //     );
  //     tsTest.line(`expect(data).toBeTruthy();`);
  //     tsTest.line(`expect(errors.length).toBe(0);`);
  //     tsTest.line(`expect(status).toBe(200);`);
  //   }

  //   /***************************************************************************
  //    *  LIST TEST
  //    **************************************************************************/

  //   if (this.operationSubType === OPERATION_SUB_TYPE.LIST) {
  //     // create some test data
  //     this.writeSeedData(tsTest);
  //     tsTest.open(
  //       `const fixture : ${this.inputStructure.ts.publicInterfaceName} = {`
  //     );
  //     tsTest.line(`lookupText: 'f',`);
  //     tsTest.close(`};`);
  //     tsTest.line(
  //       `const { data, errors, status } = await ${this.functionName}(fixture);`
  //     );
  //     tsTest.line(`console.log(data);`);
  //     tsTest.line(`expect(data).toBeTruthy();`);
  //     tsTest.line(`expect(errors.length).toBe(0);`);
  //     tsTest.line(`expect(status).toBe(200);`);
  //   }

  //   /***************************************************************************
  //    *  CLOSE TEST
  //    **************************************************************************/

  //   tsTest.close(`})`);
  //   tsTest.line("");
  // };

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
    this.createOperation.inputStructure.publicAttributes.forEach(
      (attribute) => {
        file.line(`${attribute.tsAttributeName}: "foo",`);
      }
    );
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
