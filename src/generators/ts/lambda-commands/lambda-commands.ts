import { join } from "path";
import { JsonFile } from "projen";
import { CreateCommand } from "./create-command";
import { DeleteCommand } from "./delete-command";
import { ImportCommand } from "./import-command";
import { ReadCommand } from "./read-command";
import { UpdateCommand } from "./update-command";
import { FractureComponent } from "../../../core";
import { OPERATION_SUB_TYPE } from "../../../core/operation";
import { Resource } from "../../../core/resource";

export const LAMBDA_EVENT_SOURCE = {
  APP_SYNC: "app-sync",
  API_GATEWAY: "api-gateway",
  DYNAMODB: "dynamodb",
  KAFKA: "kafka",
  KINESIS: "kinesis",
  S3: "s3",
  SNS: "sns",
  SQS: "sqs",
} as const;

export class TypeScriptLambdaCommands extends FractureComponent {
  public readonly resource: Resource;
  public readonly outdir: string;

  constructor(resource: Resource) {
    super(resource.fracture);

    this.resource = resource;
    this.outdir = join(resource.service.outdir, "lambda");

    const supportedEventSources = [
      LAMBDA_EVENT_SOURCE.APP_SYNC,
      LAMBDA_EVENT_SOURCE.API_GATEWAY,
      LAMBDA_EVENT_SOURCE.DYNAMODB,
      LAMBDA_EVENT_SOURCE.KAFKA,
      LAMBDA_EVENT_SOURCE.KINESIS,
      LAMBDA_EVENT_SOURCE.S3,
      LAMBDA_EVENT_SOURCE.SQS,
      LAMBDA_EVENT_SOURCE.SNS,
    ];

    resource.operations.forEach((operation) => {
      supportedEventSources.forEach((eventSource) => {
        const commandPath = join(
          this.outdir,
          eventSource,
          `${operation.name}-handler`
        );

        /*************************************************************************
         *
         * Package.json file
         *
         * We'll generate the package files for each handler to help esbuild cleanly
         * strip out the things it doesn't need to include
         *
         ************************************************************************/

        new JsonFile(this.fracture.project, join(commandPath, "package.json"), {
          obj: {
            name: `${operation.name}-handler`,
            version: "0.0.1",
            description: `${eventSource} handler for ${operation.name}`,
            main: "./handler.js",
            private: true,
            dependencies: {
              "@aws-sdk/client-dynamodb": "*",
              "@aws-sdk/lib-dynamodb": "*",
              "@aws-sdk/util-dynamodb": "*",
              "@types/aws-lambda": "*",
              uuid: "*",
            },
          },
        });

        /*************************************************************************
         *
         * Lambda File
         *
         * Output the lambda file for this command.
         *
         ************************************************************************/
        switch (operation.operationSubType) {
          case OPERATION_SUB_TYPE.CREATE_ONE:
            new CreateCommand(operation, commandPath, { eventSource });
            break;
          case OPERATION_SUB_TYPE.READ_ONE:
            new ReadCommand(operation, commandPath, { eventSource });
            break;
          case OPERATION_SUB_TYPE.UPDATE_ONE:
            new UpdateCommand(operation, commandPath, { eventSource });
            break;
          case OPERATION_SUB_TYPE.DELETE_ONE:
            new DeleteCommand(operation, commandPath, { eventSource });
            break;
          case OPERATION_SUB_TYPE.IMPORT_ONE:
            new ImportCommand(operation, commandPath, { eventSource });
            break;
          default:
            throw new Error(
              `Unsupported operation type: ${operation.operationSubType}`
            );
        }

        /*************************************************************************
         *
         * Jest Test
         *
         * Output a test for the command.
         *
         ************************************************************************/
      });
    });
  }
}
