import { join } from "path";
import { ValueOf } from "type-fest";
import { AccessPattern } from "../../../core/access-pattern";
import { formatStringByNamingStrategy } from "../../../core/naming-strategy";
import { Operation, OPERATION_SUB_TYPE } from "../../../core/operation";
import { Resource } from "../../../core/resource";
import { Service } from "../../../core/service";
import { Structure } from "../../../core/structure";
import { DynaliteSupport } from "../../../dynamodb";
import { TypeScriptSource } from "../typescript-source";

export class DynamoCommandTest extends TypeScriptSource {
  public readonly operation: Operation;

  constructor(operation: Operation) {
    super(
      operation,
      join(
        operation.service.srcDir,
        "ts",
        "dynamodb",
        "commands",
        `${operation.name}.spec.ts`
      )
    );

    this.operation = operation;
  }

  preSynthesize(): void {
    /***************************************************************************
     *  IMPORTS
     **************************************************************************/
    DynaliteSupport.writeJestImports(this);
    this.line(
      `import { ${this.createOperation.tsDynamoCommand.functionName} } from "./${this.createOperation.name}";`
    );
    if (
      this.createOperation.tsDynamoCommand.functionName !== this.functionName
    ) {
      this.line(
        `import { ${this.functionName} } from "./${this.operation.name}";`
      );
    }
    this.open(`import {`);
    this.line(this.inputStructure.tsInterfaceName + ",");
    this.close(`} from "${this.service.tsTypes.pathFrom(this)}";`);
    this.line("");

    /***************************************************************************
     *  CONFIGURE TESTS
     **************************************************************************/

    DynaliteSupport.writeJestConfig(this);
    this.open(`test("Smoke test", async () => {`);

    /***************************************************************************
     *  CREATE TEST
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.CREATE_ONE) {
      this.open(`const fixture : ${this.inputStructure.tsInterfaceName} = {`);
      this.inputStructure.publicAttributes.forEach((a) => {
        this.line(`${a.tsAttributeName}: "foo",`);
      });
      this.close(`};`);
      this.line(
        `const { data, errors, status } = await ${this.functionName}(fixture);`
      );
      this.line(`expect(data).toBeTruthy();`);
      this.line(`expect(errors.length).toBe(0);`);
      this.line(`expect(status).toBe(200);`);
    }

    /***************************************************************************
     *  READ TEST
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.READ_ONE) {
      // create some test data
      this.writeSeedData(this);
      // run test
      this.open(`const fixture: ${this.inputStructure.tsInterfaceName} = {`);
      this.inputStructure.publicAttributes.forEach((a) => {
        this.line(`${a.tsAttributeName}: seedData.data.${a.tsAttributeName},`);
      });
      this.close(`};`);
      this.line(
        `const { data, errors, status } = await ${this.functionName}(fixture);`
      );

      this.line(`expect(data).toBeTruthy();`);
      this.line(`expect(errors.length).toBe(0);`);
      this.line(`expect(status).toBe(200);`);
    }

    /***************************************************************************
     *  UPDATE TEST
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.UPDATE_ONE) {
      // create some test data
      this.writeSeedData(this);
      this.open(`const fixture : ${this.inputStructure.tsInterfaceName} = {`);
      this.line(`id: seedData.data.id,`);
      this.inputStructure.publicAttributes
        .filter((a) => a.name !== "id")
        .forEach((a) => {
          this.line(`${a.tsAttributeName}: "bar",`);
        });
      this.close(`};`);
      this.line(
        `const { data, errors, status } = await ${this.functionName}(fixture);`
      );
      this.line(`expect(data).toBeTruthy();`);
      this.line(`expect(errors.length).toBe(0);`);
      this.line(`expect(status).toBe(200);`);
    }

    /***************************************************************************
     *  DELETE TEST
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.DELETE_ONE) {
      // create some test data

      this.writeSeedData(this);
      this.open(`const fixture : ${this.inputStructure.tsInterfaceName} = {`);
      this.line(`id: seedData.data.id,`);
      this.close(`};`);
      this.line(
        `const { data, errors, status } = await ${this.functionName}(fixture);`
      );
      this.line(`expect(data).toBeTruthy();`);
      this.line(`expect(errors.length).toBe(0);`);
      this.line(`expect(status).toBe(200);`);
    }

    /***************************************************************************
     *  LIST TEST
     **************************************************************************/

    if (this.operationSubType === OPERATION_SUB_TYPE.LIST) {
      // create some test data

      this.writeSeedData(this);
      this.open(`const fixture : ${this.inputStructure.tsInterfaceName} = {`);
      this.line(`lookupText: 'f',`);
      this.close(`};`);
      this.line(
        `const { data, errors, status } = await ${this.functionName}(fixture);`
      );
      this.line(`console.log(data);`);
      this.line(`expect(data).toBeTruthy();`);
      this.line(`expect(errors.length).toBe(0);`);
      this.line(`expect(status).toBe(200);`);
    }

    /***************************************************************************
     *  CLOSE TEST
     **************************************************************************/

    this.close(`});`);
    this.line("");

    super.preSynthesize();
  }

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
    file.close(`}`);
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
