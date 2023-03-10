import { join } from "path";
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
    this.resource = tsOperation.resource;
    this.service = tsOperation.service;
    this.tsOperation = tsOperation;
    this.tsResource = tsOperation.tsResource;
    this.tsService = tsOperation.tsService;

    console.log(
      this.service.name,
      this.resource.name,
      `${this.operation.name}.ts`
    );

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
      `import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";`,
    ]);
    /*
    if (inputStructure.hasAttributeGenerator(ResourceAttributeGenerator.GUID)) {
      this.tsFile.line(`import { v4 as uuidv4 } from "uuid";`);
    }
    */

    // this.tsFile.open(`import {`);
    // this.tsFile.line(this.tsResource.interfaceNameForDynamo + ",");
    // this.tsFile.line(this.tsService.dynamoKeyName + ",");
    // this.tsFile.line(this.tsResource.interfaceName);
    // this.tsFile.close(
    //   `} from "${this.tsService.typeFile.pathFrom(this.tsFile)}";`
    // );
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
     *  INPUT / OUTPUT TYPES
     **************************************************************************/

    const tsInputStructure = new TypescriptStructure(
      this.operation.inputStructure
    );
    const tsOutputStructure = new TypescriptStructure(
      this.operation.outputStructure
    );
    tsInputStructure.writePublicInterface(this.tsFile);
    tsOutputStructure.writePublicInterface(this.tsFile);
    tsInputStructure.writePrivateInterface(this.tsFile);
    tsOutputStructure.writePrivateInterface(this.tsFile);

    /***************************************************************************
     *  OPEN FUNCTION
     **************************************************************************/

    this.tsFile.open(`export const ${this.functionName} = async (`);
    this.tsFile.line(
      `${this.inputName}: Required<${tsInputStructure.publicInterfaceName}>`
    );
    this.tsFile.close(
      `): Promise<${tsOutputStructure.publicInterfaceName}> => {`
    );
    this.tsFile.open("");
    this.tsFile.line("");

    /***************************************************************************
     *  UNWRAP INPUT
     **************************************************************************/

    this.tsFile.open(`const {`);
    tsInputStructure.publicAttributes.forEach((a) => {
      this.tsFile.line(`${a.attributeName},`);
    });
    this.tsFile.close(`} = ${this.inputName};`);
    this.tsFile.line("");

    /***************************************************************************
     *  DYNAMO INPUT
     **************************************************************************/

    // line up values
    tsInputStructure.privateAttributes.forEach((attribute) => {
      const p = attribute.attributeSource ? "" : "// ";
      this.tsFile.line(
        `${p}const ${attribute.attributeShortName} = ${attribute.attributeSource};`
      );
    });
    this.tsFile.line("");

    // this.tsFile.line(`/**`);
    // this.tsFile.line(
    //   ` * Initialize the shape dynamo expects. This may differ from the externally`
    // );
    // this.tsFile.line(` * exposed shape.`);
    // this.tsFile.line(` */`);
    this.tsFile.open(
      `const item: ${tsInputStructure.privateInterfaceName} = {`
    );

    tsInputStructure.privateAttributes.forEach((attribute) => {
      const p = attribute.attributeSource ? "" : "// ";
      this.tsFile.line(`${p}${attribute.attributeShortName},`);
    });
    // generatedAttributes.forEach((attribute) => {
    //   const { resourceAttribute } = attribute;
    //   const generator = resourceAttribute.generatorForOperation(this.operation);
    //   switch (generator) {
    //     case ResourceAttributeGenerator.GUID:
    //       this.tsFile.line(`${resourceAttribute.shortName}: uuidv4(),`);
    //       break;
    //     case ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP:
    //       this.tsFile.line(
    //         `${resourceAttribute.shortName}: new Date().toISOString(),`
    //       );
    //       break;
    //     case ResourceAttributeGenerator.TYPE:
    //       this.tsFile.line(
    //         `${resourceAttribute.shortName}: "${this.resource.interfaceName}",`
    //       );
    //       break;
    //     case ResourceAttributeGenerator.VERSION:
    //       this.tsFile.line(
    //         `${resourceAttribute.shortName}: "${this.resource.versionStrategy.currentVersion}",`
    //       );
    //       break;
    //     default:
    //       throw new Error(`Unknown generator: ${generator}`);
    //   }
    // });
    // publicAttributes.forEach((attribute) => {
    //   const { resourceAttribute } = attribute;
    //   this.tsFile.line(
    //     `${resourceAttribute.shortName}: input.${resourceAttribute.attributeName},`
    //   );
    // });
    this.tsFile.close(`};`);
    this.tsFile.line(`\n`);

    // /**
    //  * If we need to add key values to the shape, do it here.
    //  */
    // const pk = this.resource.keyAccessPattern.pk
    //   .map((k) => "item." + k.shortName)
    //   .join(' + "#" + ');
    // const sk = this.resource.keyAccessPattern.sk
    //   .map((k) => "item." + k.shortName)
    //   .join(' + "#" + ');
    // this.tsFile.line(`/**`);
    // this.tsFile.line(` * Add key values to the shape.`);
    // this.tsFile.line(` */`);
    // this.tsFile.open(`const key: ${this.tsService.dynamoKeyName} = {`);
    // this.tsFile.line(`${this.tsService.dynamoPkName}: ${pk},`);
    // this.tsFile.line(`${this.tsService.dynamoSkName}: ${sk},`);
    // this.tsFile.close(`};`);
    // this.tsFile.line("");

    // this.tsFile.open(`const result = await dynamo.send(`);
    // this.tsFile.open(`new ${this.dynamoCommandName}({`);
    // this.tsFile.line(`TableName: "${this.service.dynamodb.name}",`);

    // switch (this.operation.operationSubType) {
    //   case OPERATION_SUB_TYPE.CREATE_ONE:
    //     this.tsFile.line(`Item: marshall({ ...item, ...key }),`);
    //     break;
    //   case OPERATION_SUB_TYPE.READ_ONE:
    //     this.tsFile.line(`Key: marshall(key),`);
    //     break;
    //   case OPERATION_SUB_TYPE.UPDATE_ONE:
    //     this.tsFile.line(`UpdateExpression: marshall(item),`);
    //     this.tsFile.line(`ExpressionAttributeNames: marshall(item),`);
    //     this.tsFile.line(`ExpressionAttributeValues: marshall(item),`);
    //     this.tsFile.line(`Key: marshall(key),`);
    //     break;
    //   case OPERATION_SUB_TYPE.DELETE_ONE:
    //     this.tsFile.line(`Key: marshall(key),`);
    //     break;
    //   case OPERATION_SUB_TYPE.IMPORT_ONE:
    //     this.tsFile.line(`Item: marshall({ ...item, ...key }),`);
    //     break;
    //   default:
    //     throw new Error(
    //       `Unsupported operation type: ${this.operation.operationSubType}`
    //     );
    // }

    // this.tsFile.close(`})`);
    // this.tsFile.close(`);`);
    // this.tsFile.line("");

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
        return "PUTCommand";
      case OPERATION_SUB_TYPE.IMPORT_ONE:
        return "PutCommand";
      default:
        throw new Error(
          `Unsupported operation type: ${this.operation.options.operationSubType}`
        );
    }
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
}
