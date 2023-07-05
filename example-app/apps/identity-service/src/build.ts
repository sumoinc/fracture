import { determineBuildId } from "@sumoc/fracture";
import { App, Stack } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { EventBus } from "aws-cdk-lib/aws-events";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

const buildId = determineBuildId();

const serviceName = "example-app";

const app = new App();
const stack = new Stack(app, `${serviceName}-${buildId}`);
new EventBus(stack, "example-event-bus");

new NodejsFunction(stack, "foo", {
  memorySize: 512,
  runtime: Runtime.NODEJS_18_X,
  logRetention: RetentionDays.ONE_WEEK,
});

new Table(stack, "example-table", {
  partitionKey: {
    name: "id",
    type: AttributeType.STRING,
  },
});
