import { App, Stack } from "aws-cdk-lib";
import { EventBus } from "aws-cdk-lib/aws-events";

const app = new App();

const stack = new Stack(app, "example-stack");

new EventBus(stack, "example-event-bus");
