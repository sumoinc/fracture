import { Operation } from "../../../../services/operation";
import { Service } from "../../../../services/service";
import { GeneratedTypescriptFile } from "../../../generated-typescript-file";

export class CreateResaolver extends GeneratedTypescriptFile {
  constructor(
    public readonly project: Service,
    { operation }: { operation: Operation }
  ) {
    super(project, `app-sync/resolvers/ts/${operation.name}.ts`);

    [
      `import { Context, DynamoDBPutItemRequest, util } from "@aws-appsync/utils";`,
      ``,
      `export function request(`,
      `  ctx: Context<any>,`,
      `): DynamoDBPutItemRequest {`,
      `}`,
      ``,
      `export function response(ctx: Context<MutationCreatePostArgs, object, object, object, Post>) {`,
      `  return ctx.result;`,
      `}`,
      ``,
    ].forEach((line) => this.addLine(line));

    // "@aws-appsync/utils"
    //console.log("operation inputs:", operation.inputStructure.attributes);
    //console.log("operation outputs:", operation.outputStructure.attributes);

    // this.addLine(`## Initialise Resource`);
    // this.addLine(`#set( $item = {`);

    // operation.inputStructure.attributes.forEach((attr) => {
    //   this.addLine(`  ${setVtlAttribute(attr)}`);
    // });

    // this.addLine(`})`);
    // this.addLine("\n");
  }
}
